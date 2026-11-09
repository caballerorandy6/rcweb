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
import { getProjectCharges } from "@/lib/project/charges";
import { BillingAddressSchema, parseStoredBillingAddress } from "@/lib/tax/billingAddress";
import { recordChargeTax } from "@/lib/tax/recordChargeTax";
import type { ActionResult } from "@/types/common";

const CreateProjectFromQuoteSchema = z.object({
  method: z.enum(MANUAL_PAYMENT_METHODS),
  /** Calendar day the deposit arrived, YYYY-MM-DD */
  paidOn: z.iso.date(),
  /** Sales tax included in what the customer sent, in cents */
  taxCents: z.number().int().min(0).max(10_000_000),
  /** Typed by the admin when the customer never gave one (no Zelle request) */
  billingAddress: BillingAddressSchema.optional(),
});

export type CreateProjectFromQuoteInput = z.input<typeof CreateProjectFromQuoteSchema>;

export type CreateProjectFromQuoteData = {
  projectId: string;
  projectCode: string;
  /** False when the customer never accepted the terms on the quote page */
  termsRecorded: boolean;
  invoiceErrors: string[];
  /** Why the sale is not in Stripe Tax, when it could not be recorded */
  taxWarning: string | null;
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
 * The sale is then recorded in Stripe Tax from the billing address the
 * customer gave with the Zelle request.
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
    const { method, paidOn, taxCents, billingAddress: typedAddress } = parsed.data;
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
    // Sales tax depends on where the customer is: never record a deposit blind
    const billingAddress = parseStoredBillingAddress(quote.billingAddress) ?? typedAddress ?? null;
    if (!billingAddress) {
      return { success: false, error: "Enter the customer's billing address to calculate the sales tax" };
    }

    const { project, emailErrors } = await createProjectFromDeposit(
      {
        projectCode,
        customerEmail: quote.email,
        customerName: quote.name,
        locale: quote.locale,
        planName: quote.planName,
        totalAmount: quote.totalAmount,
        firstPaymentAmount: deposit,
        secondPaymentAmount: balance,
        deposit: { method, paidAt, taxAmount: taxCents },
        terms: quote.termsAcceptedAt
          ? {
              acceptedAt: quote.termsAcceptedAt,
              termsVersion: LEGAL_LAST_UPDATED.version,
              ipAddress: quote.termsIp ?? "quote-page",
              userAgent: quote.termsUserAgent ?? "quote-page",
            }
          : null,
        quoteId: quote.id,
        billingAddress,
      },
      new Resend(process.env.RESEND_API_KEY!)
    );

    // After the project exists: a Stripe Tax problem must not lose the deposit
    const taxResult = await recordChargeTax({
      projectCode: project.projectCode,
      kind: "deposit",
      amount: deposit,
      taxAmount: taxCents,
      address: billingAddress,
      calculation:
        quote.zelleTaxCalculationId && quote.zelleRequestedAt
          ? {
              id: quote.zelleTaxCalculationId,
              taxAmount: quote.zelleTaxAmount ?? 0,
              calculatedAt: quote.zelleRequestedAt,
            }
          : null,
    });
    if ("transactionId" in taxResult) {
      await prisma.payment.update({
        where: { id: getProjectCharges(project.payments).deposit.id },
        data: { stripeTaxTransactionId: taxResult.transactionId },
      });
    }

    return {
      success: true,
      data: {
        projectId: project.id,
        projectCode: project.projectCode,
        termsRecorded: quote.termsAcceptedAt !== null,
        invoiceErrors: emailErrors,
        taxWarning: "warning" in taxResult ? taxResult.warning : null,
      },
    };
  } catch (error) {
    console.error("Error creating project from quote:", error);
    Sentry.captureException(error, { tags: { feature: "quotes" }, extra: { quoteId } });
    return { success: false, error: "Failed to create the project" };
  }
}
