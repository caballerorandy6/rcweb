// src/lib/email/senders/sendSubscriptionConfirmation.tsx

import { emailTranslator } from "../i18n";
import { Resend } from "resend";
import { render } from "@react-email/components";
import {
  SubscriptionConfirmationEmail,
  type SubscriptionConfirmationEmailProps,
} from "../templates";

export interface SendSubscriptionConfirmationParams
  extends SubscriptionConfirmationEmailProps {
  customerEmail: string;
}

export async function sendSubscriptionConfirmation(
  resend: Resend,
  params: SendSubscriptionConfirmationParams
): Promise<{ success: boolean; error?: string }> {
  const { customerEmail, customerName, locale, planName, amount, nextBillingDate } =
    params;

  try {
    const html = await render(
      <SubscriptionConfirmationEmail
        customerName={customerName}
        locale={locale}
        planName={planName}
        amount={amount}
        nextBillingDate={nextBillingDate}
      />
    );

    const { error: sendError } = await resend.emails.send({
      from: "RC Web Solutions <no-reply@rcweb.dev>",
      to: customerEmail,
      subject: emailTranslator(locale)("subscription.confirmSubject", { planName }),
      html,
    });
    if (sendError) throw new Error(sendError.message);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error sending subscription confirmation:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
