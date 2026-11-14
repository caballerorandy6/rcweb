// src/lib/email/senders/sendSubscriptionCancellationChange.tsx

import { emailTranslator, formatLongDate } from "../i18n";
import { Resend } from "resend";
import { render } from "@react-email/components";
import { subscriptionPlanName } from "@/lib/maintenancePlan";
import { ADMIN_EMAIL } from "../adminEmail";
import {
  SubscriptionCancellationChangeEmail,
  type SubscriptionCancellationChangeEmailProps,
} from "../templates";

export interface SendSubscriptionCancellationChangeParams
  extends SubscriptionCancellationChangeEmailProps {
  customerEmail: string;
}

export async function sendSubscriptionCancellationChange(
  resend: Resend,
  params: SendSubscriptionCancellationChangeParams
): Promise<{ success: boolean; error?: string }> {
  const {
    customerEmail,
    kind,
    customerName,
    locale,
    planName: storedPlanName,
    date,
    manageUrl,
  } = params;
  const planName = subscriptionPlanName(storedPlanName, locale);
  const t = emailTranslator(locale);

  try {
    const html = await render(
      <SubscriptionCancellationChangeEmail
        kind={kind}
        customerName={customerName}
        locale={locale}
        planName={planName}
        date={date}
        manageUrl={manageUrl}
      />
    );

    const { error: sendError } = await resend.emails.send({
      from: "RC Web Solutions <contactus@rcweb.dev>",
      to: customerEmail,
      replyTo: ADMIN_EMAIL,
      subject:
        kind === "scheduled"
          ? t("subscription.scheduledSubject", {
              date: formatLongDate(date, locale),
            })
          : t("subscription.resumedSubject", { planName }),
      html,
    });
    if (sendError) throw new Error(sendError.message);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      "❌ Error sending subscription cancellation change email:",
      errorMessage
    );
    return { success: false, error: errorMessage };
  }
}
