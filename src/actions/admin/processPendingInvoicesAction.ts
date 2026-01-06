// actions/admin/processPendingInvoicesAction.ts
"use server";

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { createInvoiceAndSendEmail } from "@/lib/invoice/createInvoiceAndSendEmail";
import type { ActionResult } from "@/types/common";

type InvoiceResult = {
  projectCode: string;
  success: boolean;
  invoiceId?: string;
  error?: string;
};

type ProcessResult = {
  processed: number;
  results: InvoiceResult[];
};

/**
 * Server action to process pending invoices
 * Finds all payments without invoices and creates them
 */
export async function processPendingInvoicesAction(): Promise<
  ActionResult<ProcessResult>
> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);

    // Find payments without invoices
    const paymentsWithoutInvoices = await prisma.payment.findMany({
      where: {
        firstPaid: true,
        invoices: {
          none: {
            type: "initial",
          },
        },
      },
      include: {
        invoices: true,
      },
    });

    const results: InvoiceResult[] = [];

    for (const payment of paymentsWithoutInvoices) {
      try {
        const result = await createInvoiceAndSendEmail({
          payment,
          type: "initial",
          resend,
          stripeSessionId: payment.firstSessionId || undefined,
        });

        results.push({
          projectCode: payment.projectCode,
          success: true,
          invoiceId: result.invoiceId,
        });
      } catch (error) {
        console.error(`❌ Error processing ${payment.projectCode}:`, error);
        results.push({
          projectCode: payment.projectCode,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return {
      success: true,
      data: {
        processed: results.length,
        results,
      },
    };
  } catch (error) {
    console.error("❌ Error processing pending invoices:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
