// lib/invoice/createInvoiceAndSendEmail.ts
// Función helper para crear invoices y enviar emails con PDFs adjuntos

import { Resend } from "resend";
import { createInvoice, createInvoiceSummary } from "./actions";
import { InvoiceType, DEFAULT_TAX_RATE } from "./types";
import { sendInvoiceEmail } from "@/lib/email/senders";
import { getProjectUrl } from "@/lib/projectUrl";
import { getProjectCharges, type ProjectWithPayments } from "@/lib/project/charges";

interface CreateInvoiceAndSendEmailParams {
  project: ProjectWithPayments;
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
 * Crea un invoice, genera el PDF y lo envía por email.
 * La llaman el webhook de Stripe y recordManualPaymentAction; el método y la
 * fecha de pago salen del cobro (Payment) correspondiente.
 */
export async function createInvoiceAndSendEmail({
  project,
  type,
  resend,
  stripeSessionId,
}: CreateInvoiceAndSendEmailParams): Promise<InvoiceResult> {
  try {
    const { deposit, final } = getProjectCharges(project.payments);
    let invoiceResult: InvoiceResult;

    // Crear invoice según el tipo
    if (type === "summary") {
      invoiceResult = await createInvoiceSummary(project.id);
    } else {
      const charge = type === "initial" ? deposit : final;
      const amount = charge.amount;
      const description =
        type === "initial"
          ? `Initial Payment - 50% Deposit for ${project.planName}`
          : `Final Payment - 50% Balance for ${project.planName}`;

      invoiceResult = await createInvoice({
        projectId: project.id,
        type,
        customerName: project.name,
        customerEmail: project.email,
        projectCode: project.projectCode,
        planName: project.planName,
        description,
        subtotal: amount,
        taxRate: DEFAULT_TAX_RATE,
        paymentMethod: charge.method,
        stripeSessionId: charge.method === "stripe" ? stripeSessionId : undefined,
        paidDate: charge.paidAt ?? new Date(),
      });
    }

    // Descargar el PDF desde Vercel Blob
    const pdfResponse = await fetch(invoiceResult.pdfUrl);
    const pdfArrayBuffer = await pdfResponse.arrayBuffer();
    const pdfBuffer = Buffer.from(pdfArrayBuffer);

    // Enviar email usando el sender con react-email template. El sender no
    // lanza: si falla, el invoice ya existe (fila + PDF) y el que llama debe
    // enterarse para reenviarlo a mano.
    const sent = await sendInvoiceEmail(resend, {
      customerEmail: project.email,
      customerName: project.name,
      planName: project.planName,
      invoiceNumber: invoiceResult.invoiceNumber,
      firstPayment: deposit.amount,
      secondPayment: final.amount,
      totalAmount: project.totalAmount,
      type,
      pdfBuffer,
      projectUrl: getProjectUrl(project.accessToken),
    });
    if (!sent.success) {
      throw new Error(
        `${invoiceResult.invoiceNumber} was created but the email failed: ${sent.error ?? "unknown error"}`
      );
    }

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
