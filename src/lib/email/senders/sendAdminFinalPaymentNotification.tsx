// src/lib/email/senders/sendAdminFinalPaymentNotification.tsx

import { Resend } from "resend";
import { render } from "@react-email/components";
import * as React from "react";
import { AdminNotificationEmail } from "../templates";

const ADMIN_EMAIL = "admin@rcweb.dev";

export interface AdminFinalPaymentNotificationParams {
  projectCode: string;
  customerName: string;
  customerEmail: string;
  planName: string;
  finalPaymentAmount: number;
  totalAmount: number;
}

export async function sendAdminFinalPaymentNotification(
  resend: Resend,
  params: AdminFinalPaymentNotificationParams
): Promise<{ success: boolean; error?: string }> {
  const {
    projectCode,
    customerName,
    customerEmail,
    planName,
    finalPaymentAmount,
    totalAmount,
  } = params;

  try {
    const html = await render(
      <AdminNotificationEmail
        type="final_payment"
        customerName={customerName}
        customerEmail={customerEmail}
        planName={planName}
        amount={finalPaymentAmount}
        projectCode={projectCode}
        totalAmount={totalAmount}
      />
    );

    await resend.emails.send({
      from: "RC Web <no-reply@rcweb.dev>",
      to: ADMIN_EMAIL,
      subject: `Final Payment Received - ${planName} - ${projectCode}`,
      html,
    });

    console.log("✅ Admin final payment notification sent");
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.error(
      "❌ Error sending admin final payment notification:",
      errorMessage
    );
    return { success: false, error: errorMessage };
  }
}
