"use server";

import { z } from "zod";
import { Resend } from "resend";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import { getProjectCharges, isPaid } from "@/lib/project/charges";
import { createInvoiceAndSendEmail } from "@/lib/invoice/createInvoiceAndSendEmail";
import { MANUAL_PAYMENT_METHODS } from "@/lib/project/paymentMethod";
import type { ProjectStatus } from "@/generated/prisma/enums";
import type { ActionResult } from "@/types/common";

const RecordManualPaymentSchema = z.object({
  kind: z.enum(["deposit", "final"]),
  method: z.enum(MANUAL_PAYMENT_METHODS),
  /** Calendar day the money arrived, YYYY-MM-DD */
  paidOn: z.iso.date(),
});

export type RecordManualPaymentInput = z.infer<typeof RecordManualPaymentSchema>;

export type RecordManualPaymentData = {
  projectStatus: ProjectStatus;
  /** Invoices that could not be generated or emailed; the payment is recorded anyway */
  invoiceErrors: string[];
};

/** A day entered in the admin, stored at noon UTC so it reads the same in every US timezone */
function toPaidAt(paidOn: string): Date {
  return new Date(`${paidOn}T12:00:00.000Z`);
}

/**
 * Records a charge the customer paid outside Stripe (Zelle, cash, other).
 * Mirrors what the webhook does after a Checkout Session: the charge is
 * marked paid, the final payment completes the project, and the same
 * invoices go out (initial for the deposit; final + summary for the balance).
 */
export async function recordManualPaymentAction(
  projectId: string,
  input: RecordManualPaymentInput
): Promise<ActionResult<RecordManualPaymentData>> {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.authorized) {
      return { success: false, error: authCheck.error };
    }

    if (!z.uuid().safeParse(projectId).success) {
      return { success: false, error: "Invalid project" };
    }
    const parsed = RecordManualPaymentSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: z.prettifyError(parsed.error) };
    }
    const { kind, method, paidOn } = parsed.data;

    const paidAt = toPaidAt(paidOn);
    if (paidAt.getTime() > Date.now() + 24 * 60 * 60 * 1000) {
      return { success: false, error: "The payment date cannot be in the future" };
    }

    const current = await prisma.project.findUnique({
      where: { id: projectId },
      include: { payments: true, invoices: true },
    });
    if (!current) {
      return { success: false, error: "Project not found" };
    }

    const charges = getProjectCharges(current.payments);
    const charge = charges[kind];
    if (isPaid(charge)) {
      return { success: false, error: "That charge is already paid" };
    }
    if (kind === "final" && !isPaid(charges.deposit)) {
      return { success: false, error: "Record the deposit before the final payment" };
    }

    // Charge and project status in one write, like the webhook
    const statusChange: { status?: ProjectStatus } =
      kind === "final"
        ? { status: "completed" }
        : current.status === "pending"
          ? { status: "in_progress" }
          : {};

    const project = await prisma.project.update({
      where: { id: current.id },
      data: {
        ...statusChange,
        payments: {
          update: {
            where: { id: charge.id },
            data: { status: "paid", method, paidAt },
          },
        },
      },
      include: { payments: true, invoices: true },
    });

    // Same invoices the webhook sends; a failure here must not undo the payment
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const wanted = kind === "deposit" ? (["initial"] as const) : (["final", "summary"] as const);
    const invoiceErrors: string[] = [];

    for (const type of wanted) {
      if (project.invoices.some((inv) => inv.type === type)) continue;
      try {
        await createInvoiceAndSendEmail({ project, type, resend });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        invoiceErrors.push(`${type} invoice: ${message}`);
        Sentry.captureException(error, {
          tags: { feature: "manual-payment" },
          extra: { projectId: project.id, kind, method, type },
        });
      }
    }

    return {
      success: true,
      data: { projectStatus: project.status, invoiceErrors },
    };
  } catch (error) {
    console.error("Error recording manual payment:", error);
    Sentry.captureException(error, { tags: { feature: "manual-payment" } });
    return { success: false, error: "Failed to record the payment" };
  }
}
