// src/lib/email/senders/sendInvoiceEmail.tsx

import { Resend } from "resend";
import { render } from "@react-email/components";
import { InvoiceEmail, InvoiceEmailType } from "../templates";

export interface SendInvoiceEmailParams {
  customerEmail: string;
  customerName: string;
  planName: string;
  invoiceNumber: string;
  firstPayment: number;
  secondPayment: number;
  totalAmount: number;
  type: InvoiceEmailType;
  pdfBuffer?: Buffer;
}

const subjects: Record<InvoiceEmailType, (invoiceNumber: string) => string> = {
  initial: (num) => `Payment Confirmed - Invoice ${num}`,
  final: (num) => `Final Payment Received - Invoice ${num}`,
  summary: (num) => `Project Complete - Full Invoice ${num}`,
};

export async function sendInvoiceEmail(
  resend: Resend,
  params: SendInvoiceEmailParams
): Promise<{ success: boolean; error?: string }> {
  const {
    customerEmail,
    customerName,
    planName,
    invoiceNumber,
    firstPayment,
    secondPayment,
    totalAmount,
    type,
    pdfBuffer,
  } = params;

  try {
    const html = await render(
      <InvoiceEmail
        type={type}
        customerName={customerName}
        planName={planName}
        invoiceNumber={invoiceNumber}
        firstPayment={firstPayment}
        secondPayment={secondPayment}
        totalAmount={totalAmount}
      />
    );

    const emailOptions: Parameters<typeof resend.emails.send>[0] = {
      from: "RC Web <no-reply@rcweb.dev>",
      to: customerEmail,
      subject: subjects[type](invoiceNumber),
      html,
    };

    // Add PDF attachment if provided
    if (pdfBuffer) {
      emailOptions.attachments = [
        {
          filename: `${invoiceNumber}.pdf`,
          content: pdfBuffer,
        },
      ];
    }

    await resend.emails.send(emailOptions);

    console.log(`✅ Invoice email (${type}) sent to ${customerEmail}`);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Error sending invoice email (${type}):`, errorMessage);
    return { success: false, error: errorMessage };
  }
}
