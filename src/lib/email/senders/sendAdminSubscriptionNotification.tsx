// src/lib/email/senders/sendAdminSubscriptionNotification.tsx

import { Resend } from "resend";
import { render } from "@react-email/components";
import { AdminNotificationEmail } from "../templates";
import { ADMIN_EMAIL } from "../adminEmail";

type SubscriptionEvent =
  | "subscription"
  | "subscription_cancelled"
  | "subscription_cancel_scheduled"
  | "subscription_resumed"
  | "subscription_payment_failed"
  | "subscription_payment_action_required";

const SUBJECTS: Record<SubscriptionEvent, string> = {
  subscription: "New Subscription",
  subscription_cancelled: "Subscription Cancelled",
  subscription_cancel_scheduled: "Cancellation Scheduled",
  subscription_resumed: "Subscription Resumed",
  subscription_payment_failed: "Payment Failed",
  subscription_payment_action_required: "Payment Needs Authentication",
};

export interface AdminSubscriptionNotificationParams {
  /** Defaults to a new subscription. */
  event?: SubscriptionEvent;
  customerName: string;
  customerEmail: string;
  planName: string;
  amount: number;
  status: string;
  stripeSubscriptionId: string;
  /** Next charge, or the last day of service once a cancellation is scheduled */
  nextBillingDate?: Date;
  /** From the portal's cancellation survey */
  cancellationReason?: string | null;
}

export async function sendAdminSubscriptionNotification(
  resend: Resend,
  params: AdminSubscriptionNotificationParams
): Promise<{ success: boolean; error?: string }> {
  const {
    event = "subscription",
    customerName,
    customerEmail,
    planName,
    amount,
    status,
    stripeSubscriptionId,
    nextBillingDate,
    cancellationReason,
  } = params;

  try {
    const html = await render(
      <AdminNotificationEmail
        type={event}
        customerName={customerName}
        customerEmail={customerEmail}
        planName={planName}
        amount={amount}
        stripeSubscriptionId={stripeSubscriptionId}
        subscriptionStatus={status}
        nextBillingDate={nextBillingDate}
        cancellationReason={cancellationReason ?? undefined}
      />
    );

    const { error: sendError } = await resend.emails.send({
      from: "RC Web Solutions <no-reply@rcweb.dev>",
      to: ADMIN_EMAIL,
      // A new subscription is announced by plan; problems by customer.
      subject: `${SUBJECTS[event]} - ${
        event === "subscription" ? planName : customerEmail
      }`,
      html,
    });
    if (sendError) throw new Error(sendError.message);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      "❌ Error sending admin subscription notification:",
      errorMessage
    );
    return { success: false, error: errorMessage };
  }
}
