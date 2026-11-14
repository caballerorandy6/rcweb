// src/lib/email/senders/sendSubscriptionPaymentFailed.tsx

import { emailTranslator } from "../i18n";
import { Resend } from "resend";
import { render } from "@react-email/components";
import { subscriptionPlanName } from "@/lib/maintenancePlan";
import { ADMIN_EMAIL } from "../adminEmail";
import {
  SubscriptionPaymentFailedEmail,
  type SubscriptionPaymentFailedEmailProps,
} from "../templates";

export interface SendSubscriptionPaymentFailedParams
  extends SubscriptionPaymentFailedEmailProps {
  customerEmail: string;
}

export async function sendSubscriptionPaymentFailed(
  resend: Resend,
  params: SendSubscriptionPaymentFailedParams
): Promise<{ success: boolean; error?: string }> {
  const {
    customerEmail,
    customerName,
    locale,
    planName: storedPlanName,
    amount,
    updatePaymentUrl,
  } = params;
  const planName = subscriptionPlanName(storedPlanName, locale);

  try {
    const html = await render(
      <SubscriptionPaymentFailedEmail
        customerName={customerName}
        locale={locale}
        planName={planName}
        amount={amount}
        updatePaymentUrl={updatePaymentUrl}
      />
    );

    const { error: sendError } = await resend.emails.send({
      from: "RC Web Solutions <contactus@rcweb.dev>",
      to: customerEmail,
      replyTo: ADMIN_EMAIL,
      subject: emailTranslator(locale)("subscription.failedSubject"),
      html,
    });
    if (sendError) throw new Error(sendError.message);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error sending payment failed email:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
