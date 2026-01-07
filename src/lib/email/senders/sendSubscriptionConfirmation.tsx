// src/lib/email/senders/sendSubscriptionConfirmation.tsx

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
  const { customerEmail, customerName, planName, amount, nextBillingDate } =
    params;

  try {
    const html = await render(
      <SubscriptionConfirmationEmail
        customerName={customerName}
        planName={planName}
        amount={amount}
        nextBillingDate={nextBillingDate}
      />
    );

    await resend.emails.send({
      from: "RC Web <no-reply@rcweb.dev>",
      to: customerEmail,
      subject: `Subscription Confirmed - ${planName}`,
      html,
    });

    console.log("✅ Subscription confirmation email sent to:", customerEmail);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error sending subscription confirmation:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
