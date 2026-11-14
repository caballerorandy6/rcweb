// src/lib/email/senders/sendInvoiceEmail.tsx

import { Resend } from "resend";
import { render } from "@react-email/components";
import { ADMIN_EMAIL } from "../adminEmail";
import { InvoiceEmail, InvoiceEmailType } from "../templates";
import { emailTranslator } from "../i18n";
import type { Locale } from "@/i18n/routing";

export interface SendInvoiceEmailParams {
  customerEmail: string;
  customerName: string;
  locale: Locale;
  planName: string;
  invoiceNumber: string;
  firstPayment: number;
  depositTax: number;
  secondPayment: number;
  totalAmount: number;
  type: InvoiceEmailType;
  pdfBuffer?: Buffer;
  projectUrl?: string;
}

const subjectKeys = {
  initial: "invoice.subjectInitial",
  final: "invoice.subjectFinal",
  summary: "invoice.subjectSummary",
} as const;

export async function sendInvoiceEmail(
  resend: Resend,
  params: SendInvoiceEmailParams
): Promise<{ success: boolean; error?: string }> {
  const {
    customerEmail,
    customerName,
    locale,
    planName,
    invoiceNumber,
    firstPayment,
    depositTax,
    secondPayment,
    totalAmount,
    type,
    pdfBuffer,
    projectUrl,
  } = params;

  try {
    const html = await render(
      <InvoiceEmail
        type={type}
        customerName={customerName}
        locale={locale}
        planName={planName}
        invoiceNumber={invoiceNumber}
        firstPayment={firstPayment}
        depositTax={depositTax}
        secondPayment={secondPayment}
        totalAmount={totalAmount}
        projectUrl={projectUrl}
      />
    );

    const emailOptions: Parameters<typeof resend.emails.send>[0] = {
      from: "RC Web Solutions <contactus@rcweb.dev>",
      to: customerEmail,
      replyTo: ADMIN_EMAIL,
      subject: emailTranslator(locale)(subjectKeys[type], { number: invoiceNumber }),
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

    const { error: sendError } = await resend.emails.send(emailOptions);
    if (sendError) throw new Error(sendError.message);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Error sending invoice email (${type}):`, errorMessage);
    return { success: false, error: errorMessage };
  }
}
