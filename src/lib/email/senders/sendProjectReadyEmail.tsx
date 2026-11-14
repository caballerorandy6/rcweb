// src/lib/email/senders/sendProjectReadyEmail.tsx

import { emailTranslator } from "../i18n";
import type { Locale } from "@/i18n/routing";
import { Resend } from "resend";
import { render } from "@react-email/components";
import { ADMIN_EMAIL } from "../adminEmail";
import { ProjectReadyEmail } from "../templates";

export interface SendProjectReadyEmailParams {
  customerEmail: string;
  customerName: string;
  locale: Locale;
  planName: string;
  projectCode: string;
  finalAmount: number;
  paymentUrl: string;
}

export async function sendProjectReadyEmail(
  resend: Resend,
  params: SendProjectReadyEmailParams
): Promise<{ success: boolean; error?: string }> {
  const {
    customerEmail,
    customerName,
    locale,
    planName,
    projectCode,
    finalAmount,
    paymentUrl,
  } = params;

  try {
    const html = await render(
      <ProjectReadyEmail
        customerName={customerName}
        locale={locale}
        planName={planName}
        projectCode={projectCode}
        finalAmount={finalAmount}
        customerEmail={customerEmail}
        paymentUrl={paymentUrl}
      />
    );


    const { error: sendError } = await resend.emails.send({
      from: "RC Web Solutions <contactus@rcweb.dev>",
      to: customerEmail,
      replyTo: ADMIN_EMAIL,
      subject: emailTranslator(locale)("ready.subject", {
        planName,
        amount: `$${(finalAmount / 100).toFixed(2)}`,
      }),
      html,
    });
    if (sendError) throw new Error(sendError.message);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error sending project ready email:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
