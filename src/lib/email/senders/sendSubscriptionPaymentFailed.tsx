// src/lib/email/senders/sendSubscriptionPaymentFailed.tsx

import { Resend } from "resend";
import { render } from "@react-email/components";
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
  const { customerEmail, customerName, planName, amount, updatePaymentUrl } =
    params;

  try {
    const html = await render(
      <SubscriptionPaymentFailedEmail
        customerName={customerName}
        planName={planName}
        amount={amount}
        updatePaymentUrl={updatePaymentUrl}
      />
    );

    const { error: sendError } = await resend.emails.send({
      from: "RC Web Solutions <no-reply@rcweb.dev>",
      to: customerEmail,
      subject: "Payment Failed - Action Required",
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
