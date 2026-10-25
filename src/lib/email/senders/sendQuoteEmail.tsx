// src/lib/email/senders/sendQuoteEmail.tsx

import { render } from "@react-email/components";
import { QuoteEmail, type QuoteEmailProps } from "../templates";
import { ADMIN_EMAIL } from "../adminEmail";
import { sendEmailWithQuota } from "@/lib/sendEmailWithQuota";

export interface SendQuoteEmailParams extends QuoteEmailProps {
  customerEmail: string;
}

/** The customer's link to /quote/[token]. Fails (instead of silently skipping) when the daily quota is gone. */
export async function sendQuoteEmail(
  params: SendQuoteEmailParams
): Promise<{ success: boolean; error?: string }> {
  const { customerEmail, ...props } = params;

  try {
    const html = await render(<QuoteEmail {...props} />);

    const result = await sendEmailWithQuota(
      {
        from: "RC Web Solutions <contactus@rcweb.dev>",
        to: customerEmail,
        // "Just reply to this email" must reach the monitored inbox
        replyTo: ADMIN_EMAIL,
        subject: `Your quote ${props.quoteNumber} for ${props.planName} - RC Web Solutions`,
        html,
      },
      { failOnQuotaExceeded: true }
    );

    return result.success ? { success: true } : { success: false, error: result.error };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error sending quote email:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
