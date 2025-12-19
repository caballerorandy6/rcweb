// src/lib/email/senders/sendAdminSubscriptionNotification.tsx

import { Resend } from "resend";
import { render } from "@react-email/components";
import * as React from "react";
import { AdminNotificationEmail } from "../templates";

const ADMIN_EMAIL = "admin@rcweb.dev";

export interface AdminSubscriptionNotificationParams {
  customerName: string;
  customerEmail: string;
  planName: string;
  amount: number;
  status: string;
  stripeSubscriptionId: string;
  nextBillingDate: Date;
}

export async function sendAdminSubscriptionNotification(
  resend: Resend,
  params: AdminSubscriptionNotificationParams
): Promise<{ success: boolean; error?: string }> {
  const {
    customerName,
    customerEmail,
    planName,
    amount,
    status,
    stripeSubscriptionId,
    nextBillingDate,
  } = params;

  try {
    const html = await render(
      <AdminNotificationEmail
        type="subscription"
        customerName={customerName}
        customerEmail={customerEmail}
        planName={planName}
        amount={amount}
        stripeSubscriptionId={stripeSubscriptionId}
        subscriptionStatus={status}
        nextBillingDate={nextBillingDate}
      />
    );

    await resend.emails.send({
      from: "RC Web <no-reply@rcweb.dev>",
      to: ADMIN_EMAIL,
      subject: `New Subscription - ${planName}`,
      html,
    });

    console.log("✅ Admin subscription notification sent");
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.error(
      "❌ Error sending admin subscription notification:",
      errorMessage
    );
    return { success: false, error: errorMessage };
  }
}
