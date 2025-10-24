import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { createInvoiceAndSendEmail } from "@/lib/invoice/createInvoiceAndSendEmail";

export async function POST() {
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

    console.log(`Found ${paymentsWithoutInvoices.length} payments without initial invoices`);

    const results = [];

    for (const payment of paymentsWithoutInvoices) {
      try {
        console.log(`Processing payment ${payment.projectCode}...`);

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

        console.log(`✅ Invoice created for ${payment.projectCode}`);
      } catch (error) {
        console.error(`❌ Error processing ${payment.projectCode}:`, error);
        results.push({
          projectCode: payment.projectCode,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error("Error processing pending invoices:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
