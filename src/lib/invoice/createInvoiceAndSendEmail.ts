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
 * Crea un invoice, genera el PDF y lo envía por email
 * Esta función se llama desde el webhook de Stripe
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
      const amount = type === "initial" ? deposit.amount : final.amount;
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
        stripeSessionId,
      });
    }

    // Descargar el PDF desde Vercel Blob
    const pdfResponse = await fetch(invoiceResult.pdfUrl);
    const pdfArrayBuffer = await pdfResponse.arrayBuffer();
    const pdfBuffer = Buffer.from(pdfArrayBuffer);

    // Enviar email usando el sender con react-email template
    await sendInvoiceEmail(resend, {
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
