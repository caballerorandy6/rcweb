// src/lib/email/senders/sendAdminInitialPaymentNotification.tsx

import { Resend } from "resend";
import { render } from "@react-email/components";
import { AdminNotificationEmail } from "../templates";
import { ADMIN_EMAIL } from "../adminEmail";

export interface AdminInitialPaymentNotificationParams {
  projectCode: string;
  customerName: string;
  customerEmail: string;
  planName: string;
  firstPaymentAmount: number;
  secondPaymentAmount: number;
  projectId: string;
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
    projectId,
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
        projectId={projectId}
        pendingAmount={secondPaymentAmount}
      />
    );

    const { error: sendError } = await resend.emails.send({
      from: "RC Web Solutions <no-reply@rcweb.dev>",
      to: ADMIN_EMAIL,
      subject: `New advance payment received - Project ${projectCode}`,
      html,
    });
    if (sendError) throw new Error(sendError.message);

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
