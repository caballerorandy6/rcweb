// src/lib/email/senders/sendSubscriptionPortalLink.tsx

import { emailTranslator } from "../i18n";
import { Resend } from "resend";
import { render } from "@react-email/components";
import { subscriptionPlanName } from "@/lib/maintenancePlan";
import { ADMIN_EMAIL } from "../adminEmail";
import {
  SubscriptionPortalLinkEmail,
  type SubscriptionPortalLinkEmailProps,
} from "../templates";

export interface SendSubscriptionPortalLinkParams
  extends SubscriptionPortalLinkEmailProps {
  customerEmail: string;
}

export async function sendSubscriptionPortalLink(
  resend: Resend,
  params: SendSubscriptionPortalLinkParams
): Promise<{ success: boolean; error?: string }> {
  const {
    customerEmail,
    customerName,
    locale,
    portalUrl,
    planName: storedPlanName,
  } = params;
  const planName = subscriptionPlanName(storedPlanName, locale);

  try {
    const html = await render(
      <SubscriptionPortalLinkEmail
        customerName={customerName}
        locale={locale}
        portalUrl={portalUrl}
        planName={planName}
      />
    );

    const { error: sendError } = await resend.emails.send({
      from: "RC Web Solutions <contactus@rcweb.dev>",
      to: customerEmail,
      replyTo: ADMIN_EMAIL,
      subject: emailTranslator(locale)("subscription.portalSubject"),
      html,
    });
    if (sendError) throw new Error(sendError.message);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error sending subscription portal link:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
