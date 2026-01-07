// src/lib/email/senders/sendSubscriptionRenewalReminder.tsx

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
    planName,
    amount,
    renewalDate,
    manageUrl,
  } = params;

  try {
    const html = await render(
      <SubscriptionRenewalReminderEmail
        customerName={customerName}
        planName={planName}
        amount={amount}
        renewalDate={renewalDate}
        manageUrl={manageUrl}
      />
    );

    await resend.emails.send({
      from: "RC Web <no-reply@rcweb.dev>",
      to: customerEmail,
      subject: `Upcoming Renewal - ${planName}`,
      html,
    });

    console.log("✅ Subscription renewal reminder sent to:", customerEmail);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error sending renewal reminder:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
