"use server";

import { z } from "zod";
import { Resend } from "resend";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import { LEGAL_LAST_UPDATED } from "@/lib/company";
import { splitDepositAmount } from "@/lib/project/charges";
import { uniqueProjectCode } from "@/lib/project/uniqueProjectCode";
import { createProjectFromDeposit } from "@/lib/project/createProjectFromDeposit";
import { MANUAL_PAYMENT_METHODS } from "@/lib/project/paymentMethod";
import type { ActionResult } from "@/types/common";

const CreateProjectFromQuoteSchema = z.object({
  method: z.enum(MANUAL_PAYMENT_METHODS),
  /** Calendar day the deposit arrived, YYYY-MM-DD */
  paidOn: z.iso.date(),
});

export type CreateProjectFromQuoteInput = z.infer<typeof CreateProjectFromQuoteSchema>;

export type CreateProjectFromQuoteData = {
  projectId: string;
  projectCode: string;
  /** False when the customer never accepted the terms on the quote page */
  termsRecorded: boolean;
  invoiceErrors: string[];
};

/** A day entered in the admin, stored at noon UTC so it reads the same in every US timezone */
function toPaidAt(paidOn: string): Date {
  return new Date(`${paidOn}T12:00:00.000Z`);
}

/**
 * The deposit of a sent quote arrived outside Stripe (Zelle, cash). Creates
 * the project exactly as the webhook would: deposit paid with its method,
 * balance pending, terms acceptance copied from the quote page when the
 * customer recorded one, quote accepted, lead won, initial invoice emailed.
 */
export async function createProjectFromQuoteAction(
  quoteId: string,
  input: CreateProjectFromQuoteInput
): Promise<ActionResult<CreateProjectFromQuoteData>> {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.authorized) {
      return { success: false, error: authCheck.error };
    }
    if (!z.uuid().safeParse(quoteId).success) {
      return { success: false, error: "Invalid quote" };
    }
    const parsed = CreateProjectFromQuoteSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: z.prettifyError(parsed.error) };
    }
    const { method, paidOn } = parsed.data;
    const paidAt = toPaidAt(paidOn);
    if (paidAt.getTime() > Date.now() + 24 * 60 * 60 * 1000) {
      return { success: false, error: "The payment date cannot be in the future" };
    }

    const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
    if (!quote) {
      return { success: false, error: "Quote not found" };
    }
    if (quote.projectId || quote.status === "accepted") {
      return { success: false, error: "This quote already has a project" };
    }
    // An expired quote can still be honoured: the money is in the bank
    if (quote.status !== "sent") {
      return { success: false, error: `A ${quote.status} quote cannot be turned into a project` };
    }

    const { deposit, balance } = splitDepositAmount(quote.totalAmount);
    const projectCode = await uniqueProjectCode();

    const { project, emailErrors } = await createProjectFromDeposit(
      {
        projectCode,
        customerEmail: quote.email,
        customerName: quote.name,
        planName: quote.planName,
        totalAmount: quote.totalAmount,
        firstPaymentAmount: deposit,
        secondPaymentAmount: balance,
        deposit: { method, paidAt },
        terms: quote.termsAcceptedAt
          ? {
              acceptedAt: quote.termsAcceptedAt,
              termsVersion: LEGAL_LAST_UPDATED.version,
              ipAddress: quote.termsIp ?? "quote-page",
              userAgent: quote.termsUserAgent ?? "quote-page",
            }
          : null,
        quoteId: quote.id,
      },
      new Resend(process.env.RESEND_API_KEY!)
    );

    return {
      success: true,
      data: {
        projectId: project.id,
        projectCode: project.projectCode,
        termsRecorded: quote.termsAcceptedAt !== null,
        invoiceErrors: emailErrors,
      },
    };
  } catch (error) {
    console.error("Error creating project from quote:", error);
    Sentry.captureException(error, { tags: { feature: "quotes" }, extra: { quoteId } });
    return { success: false, error: "Failed to create the project" };
  }
}
