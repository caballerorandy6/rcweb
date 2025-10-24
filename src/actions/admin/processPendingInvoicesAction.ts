// actions/admin/processPendingInvoicesAction.ts
"use server";

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { createInvoiceAndSendEmail } from "@/lib/invoice/createInvoiceAndSendEmail";

type InvoiceResult = {
  projectCode: string;
  success: boolean;
  invoiceId?: string;
  error?: string;
};

type ProcessInvoicesResult = {
  success: boolean;
  processed: number;
  results: InvoiceResult[];
  error?: string;
};

/**
 * Server action to process pending invoices
 * Finds all payments without invoices and creates them
 */
export async function processPendingInvoicesAction(): Promise<ProcessInvoicesResult> {
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
      processed: results.length,
      results,
    };
  } catch (error) {
    console.error("❌ Error processing pending invoices:", error);
    return {
      success: false,
      processed: 0,
      results: [],
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
