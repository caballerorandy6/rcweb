// src/lib/email/senders/sendSubscriptionRenewalReminder.tsx

import { emailTranslator } from "../i18n";
import { Resend } from "resend";
import { render } from "@react-email/components";
import {
  SubscriptionRenewalReminderEmail,
  type SubscriptionRenewalReminderEmailProps,
} from "../templates";

export interface SendSubscriptionRenewalReminderParams
  extends SubscriptionRenewalReminderEmailProps {
  customerEmail: string;
}

export async function sendSubscriptionRenewalReminder(
  resend: Resend,
  params: SendSubscriptionRenewalReminderParams
): Promise<{ success: boolean; error?: string }> {
  const {
    customerEmail,
    customerName,
    locale,
    planName,
    amount,
    renewalDate,
    manageUrl,
  } = params;

  try {
    const html = await render(
      <SubscriptionRenewalReminderEmail
        customerName={customerName}
        locale={locale}
        planName={planName}
        amount={amount}
        renewalDate={renewalDate}
        manageUrl={manageUrl}
      />
    );

    const { error: sendError } = await resend.emails.send({
      from: "RC Web Solutions <no-reply@rcweb.dev>",
      to: customerEmail,
      subject: emailTranslator(locale)("subscription.renewalSubject", { planName }),
      html,
    });
    if (sendError) throw new Error(sendError.message);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error sending renewal reminder:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
