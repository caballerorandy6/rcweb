// src/lib/email/senders/sendSubscriptionCancelled.tsx

import { emailTranslator } from "../i18n";
import { Resend } from "resend";
import { render } from "@react-email/components";
import { subscriptionPlanName } from "@/lib/maintenancePlan";
import {
  SubscriptionCancelledEmail,
  type SubscriptionCancelledEmailProps,
} from "../templates";
import { ADMIN_EMAIL } from "../adminEmail";

export interface SendSubscriptionCancelledParams
  extends SubscriptionCancelledEmailProps {
  customerEmail: string;
}

export async function sendSubscriptionCancelled(
  resend: Resend,
  params: SendSubscriptionCancelledParams
): Promise<{ success: boolean; error?: string }> {
  const {
    customerEmail,
    customerName,
    locale,
    planName: storedPlanName,
    endedAt,
  } = params;
  const planName = subscriptionPlanName(storedPlanName, locale);

  try {
    const html = await render(
      <SubscriptionCancelledEmail
        customerName={customerName}
        locale={locale}
        planName={planName}
        endedAt={endedAt}
      />
    );

    // The email invites the customer to reply, so replies reach the admin.
    const { error: sendError } = await resend.emails.send({
      from: "RC Web Solutions <contactus@rcweb.dev>",
      to: customerEmail,
      replyTo: ADMIN_EMAIL,
      subject: emailTranslator(locale)("subscription.cancelledSubject", {
        planName,
      }),
      html,
    });
    if (sendError) throw new Error(sendError.message);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      "❌ Error sending subscription cancelled email:",
      errorMessage
    );
    return { success: false, error: errorMessage };
  }
}
