// src/lib/email/senders/sendSubscriptionPortalLink.tsx

import { Resend } from "resend";
import { render } from "@react-email/components";
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
  const { customerEmail, customerName, portalUrl, planName } = params;

  try {
    const html = await render(
      <SubscriptionPortalLinkEmail
        customerName={customerName}
        portalUrl={portalUrl}
        planName={planName}
      />
    );

    await resend.emails.send({
      from: "RC Web <no-reply@rcweb.dev>",
      to: customerEmail,
      subject: "Manage Your Subscription - RC Web Solutions",
      html,
    });

    console.log("✅ Subscription portal link email sent to:", customerEmail);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error sending subscription portal link:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
