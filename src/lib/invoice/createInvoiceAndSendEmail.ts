// lib/invoice/createInvoiceAndSendEmail.ts
// Función helper para crear invoices y enviar emails con PDFs adjuntos

import { Resend } from "resend";
import { Payment } from "@prisma/client";
import { createInvoice, createInvoiceSummary } from "./actions";
import { InvoiceType, DEFAULT_TAX_RATE } from "./types";

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
      // Invoice summary (ambos pagos)
      invoiceResult = await createInvoiceSummary(payment.id);
    } else {
      // Invoice individual (initial o final)
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

    // Preparar el email según el tipo de invoice
    let subject: string;
    let htmlContent: string;

    if (type === "initial") {
      subject = `✅ Payment Confirmed - Invoice ${invoiceResult.invoiceNumber}`;
      htmlContent = generateInitialPaymentEmail(
        payment,
        invoiceResult.invoiceNumber
      );
    } else if (type === "final") {
      subject = `🎉 Final Payment Received - Invoice ${invoiceResult.invoiceNumber}`;
      htmlContent = generateFinalPaymentEmail(
        payment,
        invoiceResult.invoiceNumber
      );
    } else {
      // summary
      subject = `📄 Project Complete - Full Invoice ${invoiceResult.invoiceNumber}`;
      htmlContent = generateSummaryEmail(payment, invoiceResult.invoiceNumber);
    }

    // Enviar email con PDF adjunto
    await resend.emails.send({
      from: "RC Web <no-reply@rcweb.dev>",
      to: payment.email,
      subject,
      html: htmlContent,
      attachments: [
        {
          filename: `${invoiceResult.invoiceNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    console.log(
      `✅ Invoice ${invoiceResult.invoiceNumber} created and sent to ${payment.email}`
    );

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

/**
 * Genera el HTML del email para pago inicial
 */
function generateInitialPaymentEmail(
  payment: Payment,
  invoiceNumber: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f3f4f6;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f3f4f6; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 48px 32px; text-align: center;">
                    <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); border-radius: 50%; padding: 16px; margin-bottom: 16px;">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">Payment Confirmed!</h1>
                    <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Your invoice is attached</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 32px;">
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                      Hi <strong>${payment.name}</strong>,
                    </p>
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                      Thank you for your initial payment. We've started working on your <strong style="color: #7c3aed;">${payment.planName}</strong> project!
                    </p>
                    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 32px 0;">
                      <p style="margin: 0 0 8px 0; color: #92400e; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                        Your Invoice Number
                      </p>
                      <p style="margin: 8px 0; font-family: 'Courier New', monospace; font-size: 28px; color: #d97706; font-weight: bold; letter-spacing: 2px;">
                        ${invoiceNumber}
                      </p>
                      <p style="margin: 8px 0 0 0; color: #92400e; font-size: 13px;">
                        PDF invoice attached to this email
                      </p>
                    </div>
                    <div style="background-color: #f3f4f6; border-radius: 12px; padding: 20px; margin: 0 0 32px 0;">
                      <h3 style="color: #111827; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">Payment Summary</h3>
                      <table style="width: 100%; font-size: 14px;">
                        <tr>
                          <td style="padding: 4px 0; color: #6b7280;">Initial Payment (50%):</td>
                          <td style="text-align: right; color: #059669; font-weight: 600;">$${(payment.firstPayment / 100).toFixed(2)} ✓</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; color: #6b7280;">Remaining Balance:</td>
                          <td style="text-align: right; color: #6b7280;">$${(payment.secondPayment / 100).toFixed(2)}</td>
                        </tr>
                        <tr style="border-top: 1px solid #d1d5db;">
                          <td style="padding: 8px 0 0 0; color: #374151; font-weight: 600;">Total Project Cost:</td>
                          <td style="padding: 8px 0 0 0; text-align: right; color: #374151; font-weight: 600;">$${(payment.totalAmount / 100).toFixed(2)}</td>
                        </tr>
                      </table>
                    </div>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
                    <p style="text-align: center; color: #6b7280; font-size: 14px; margin: 0;">
                      Questions? Contact us at <a href="mailto:admin@rcweb.dev" style="color: #7c3aed; text-decoration: none;">admin@rcweb.dev</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

/**
 * Genera el HTML del email para pago final
 */
function generateFinalPaymentEmail(
  payment: Payment,
  invoiceNumber: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f3f4f6;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f3f4f6; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <tr>
                  <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 48px 32px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">Final Payment Received!</h1>
                    <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Your ${payment.planName} is ready</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 32px;">
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                      Hi <strong>${payment.name}</strong>,
                    </p>
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                      Your final payment of <strong style="color: #059669; font-size: 18px;">$${(payment.secondPayment / 100).toFixed(2)}</strong> has been received.
                      Your project is now complete!
                    </p>
                    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 32px 0;">
                      <p style="margin: 0 0 8px 0; color: #92400e; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                        Invoice Number
                      </p>
                      <p style="margin: 8px 0; font-family: 'Courier New', monospace; font-size: 28px; color: #d97706; font-weight: bold; letter-spacing: 2px;">
                        ${invoiceNumber}
                      </p>
                      <p style="margin: 8px 0 0 0; color: #92400e; font-size: 13px;">
                        PDF invoice attached • Full summary coming next
                      </p>
                    </div>
                    <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; text-align: center;">
                      <p style="color: #065f46; font-size: 14px; margin: 0;">
                        ✓ You will receive a complete project summary invoice in a separate email
                      </p>
                    </div>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
                    <p style="text-align: center; color: #6b7280; font-size: 14px; margin: 0;">
                      Questions? Contact us at <a href="mailto:admin@rcweb.dev" style="color: #7c3aed; text-decoration: none;">admin@rcweb.dev</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

/**
 * Genera el HTML del email para invoice summary
 */
function generateSummaryEmail(
  payment: Payment,
  invoiceNumber: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f3f4f6;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f3f4f6; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                <tr>
                  <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 48px 32px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">Project Complete!</h1>
                    <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Full Invoice Summary</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 32px;">
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                      Hi <strong>${payment.name}</strong>,
                    </p>
                    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                      Here is your complete invoice summary for the <strong>${payment.planName}</strong> project.
                      This invoice shows both payments and the total amount paid.
                    </p>
                    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 32px 0;">
                      <p style="margin: 0 0 8px 0; color: #92400e; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                        Summary Invoice Number
                      </p>
                      <p style="margin: 8px 0; font-family: 'Courier New', monospace; font-size: 28px; color: #d97706; font-weight: bold; letter-spacing: 2px;">
                        ${invoiceNumber}
                      </p>
                      <p style="margin: 8px 0 0 0; color: #92400e; font-size: 13px;">
                        Complete project invoice attached
                      </p>
                    </div>
                    <div style="background-color: #f3f4f6; border-radius: 12px; padding: 20px; margin: 0 0 32px 0;">
                      <h3 style="color: #111827; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">Total Paid</h3>
                      <p style="margin: 0; font-size: 36px; font-weight: bold; color: #10b981;">
                        $${(payment.totalAmount / 100).toFixed(2)}
                      </p>
                      <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 14px;">
                        ✓ All payments received
                      </p>
                    </div>
                    <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #10b981;">
                      <p style="color: #065f46; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">
                        ✓ PROJECT COMPLETED
                      </p>
                      <p style="color: #065f46; font-size: 14px; margin: 0;">
                        Thank you for choosing RC Web Solutions!
                      </p>
                    </div>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
                    <p style="text-align: center; color: #6b7280; font-size: 14px; margin: 0;">
                      Questions? Contact us at <a href="mailto:admin@rcweb.dev" style="color: #7c3aed; text-decoration: none;">admin@rcweb.dev</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
