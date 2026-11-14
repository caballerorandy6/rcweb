// src/lib/email/senders/sendSubscriptionRenewalReminder.tsx

import { emailTranslator } from "../i18n";
import { Resend } from "resend";
import { render } from "@react-email/components";
import { subscriptionPlanName } from "@/lib/maintenancePlan";
import { ADMIN_EMAIL } from "../adminEmail";
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
    planName: storedPlanName,
    amount,
    renewalDate,
    manageUrl,
  } = params;
  const planName = subscriptionPlanName(storedPlanName, locale);

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
      from: "RC Web Solutions <contactus@rcweb.dev>",
      to: customerEmail,
      replyTo: ADMIN_EMAIL,
      subject: emailTranslator(locale)("subscription.renewalSubject", {
        planName,
      }),
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
