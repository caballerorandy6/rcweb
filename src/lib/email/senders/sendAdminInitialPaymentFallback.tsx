// src/lib/email/senders/sendAdminInitialPaymentFallback.tsx

import { Resend } from "resend";
import { render } from "@react-email/components";
import * as React from "react";
import { AdminNotificationEmail } from "../templates";

const ADMIN_EMAIL = "admin@rcweb.dev";

export interface AdminInitialPaymentFallbackParams {
  projectCode: string;
  customerName: string;
  customerEmail: string;
  planName: string;
  firstPaymentAmount: number;
  paymentId: string;
}

export async function sendAdminInitialPaymentFallback(
  resend: Resend,
  params: AdminInitialPaymentFallbackParams
): Promise<{ success: boolean; error?: string }> {
  const {
    projectCode,
    customerName,
    customerEmail,
    planName,
    firstPaymentAmount,
    paymentId,
  } = params;

  try {
    const html = await render(
      <AdminNotificationEmail
        type="initial_payment"
        customerName={customerName}
        customerEmail={customerEmail}
        planName={planName}
        amount={firstPaymentAmount}
        projectCode={projectCode}
        paymentId={paymentId}
        isFallback={true}
      />
    );

    await resend.emails.send({
      from: "RC Web <no-reply@rcweb.dev>",
      to: ADMIN_EMAIL,
      subject: `New payment (FALLBACK) - ${projectCode}`,
      html,
    });

    console.log("✅ Admin fallback payment notification sent");
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.error(
      "❌ Error sending admin fallback payment notification:",
      errorMessage
    );
    return { success: false, error: errorMessage };
  }
}
