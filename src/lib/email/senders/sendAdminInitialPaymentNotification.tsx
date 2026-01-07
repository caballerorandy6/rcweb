// src/lib/email/senders/sendAdminInitialPaymentNotification.tsx

import { Resend } from "resend";
import { render } from "@react-email/components";
import { AdminNotificationEmail } from "../templates";

const ADMIN_EMAIL = "admin@rcweb.dev";

export interface AdminInitialPaymentNotificationParams {
  projectCode: string;
  customerName: string;
  customerEmail: string;
  planName: string;
  firstPaymentAmount: number;
  secondPaymentAmount: number;
  paymentId: string;
}

export async function sendAdminInitialPaymentNotification(
  resend: Resend,
  params: AdminInitialPaymentNotificationParams
): Promise<{ success: boolean; error?: string }> {
  const {
    projectCode,
    customerName,
    customerEmail,
    planName,
    firstPaymentAmount,
    secondPaymentAmount,
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
        pendingAmount={secondPaymentAmount}
      />
    );

    await resend.emails.send({
      from: "RC Web <no-reply@rcweb.dev>",
      to: ADMIN_EMAIL,
      subject: `New advance payment received - Project ${projectCode}`,
      html,
    });

    console.log("✅ Admin initial payment notification sent");
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      "❌ Error sending admin initial payment notification:",
      errorMessage
    );
    return { success: false, error: errorMessage };
  }
}
