// lib/invoice/createInvoiceAndSendEmail.ts
// Función helper para crear invoices y enviar emails con PDFs adjuntos

import { Resend } from "resend";
import { Payment } from "@/generated/prisma/client";
import { createInvoice, createInvoiceSummary } from "./actions";
import { InvoiceType, DEFAULT_TAX_RATE } from "./types";
import { sendInvoiceEmail } from "@/lib/email/senders";

interface CreateInvoiceAndSendEmailParams {
  payment: Payment;
  type: InvoiceType;
  resend: Resend;
  stripeSessionId?: string;
}

interface InvoiceResult {
  invoiceId: string;
  invoiceNumber: string;
  pdfUrl: string;
}

/**
 * Crea un invoice, genera el PDF y lo envía por email
 * Esta función se llama desde el webhook de Stripe
 */
export async function createInvoiceAndSendEmail({
  payment,
  type,
  resend,
  stripeSessionId,
}: CreateInvoiceAndSendEmailParams): Promise<InvoiceResult> {
  try {
    let invoiceResult: InvoiceResult;

    // Crear invoice según el tipo
    if (type === "summary") {
      invoiceResult = await createInvoiceSummary(payment.id);
    } else {
      const amount = type === "initial" ? payment.firstPayment : payment.secondPayment;
      const description =
        type === "initial"
          ? `Initial Payment - 50% Deposit for ${payment.planName}`
          : `Final Payment - 50% Balance for ${payment.planName}`;

      invoiceResult = await createInvoice({
        paymentId: payment.id,
        type,
        customerName: payment.name,
        customerEmail: payment.email,
        projectCode: payment.projectCode,
        planName: payment.planName,
        description,
        subtotal: amount,
        taxRate: DEFAULT_TAX_RATE,
        stripeSessionId,
      });
    }

    // Descargar el PDF desde Vercel Blob
    const pdfResponse = await fetch(invoiceResult.pdfUrl);
    const pdfArrayBuffer = await pdfResponse.arrayBuffer();
    const pdfBuffer = Buffer.from(pdfArrayBuffer);

    // Enviar email usando el sender con react-email template
    await sendInvoiceEmail(resend, {
      customerEmail: payment.email,
      customerName: payment.name,
      planName: payment.planName,
      invoiceNumber: invoiceResult.invoiceNumber,
      firstPayment: payment.firstPayment,
      secondPayment: payment.secondPayment,
      totalAmount: payment.totalAmount,
      type,
      pdfBuffer,
    });

    return invoiceResult;
  } catch (error) {
    console.error("Error creating invoice and sending email:", error);
    throw new Error(
      `Failed to create invoice and send email: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
