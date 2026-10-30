// src/lib/email/senders/sendProjectReadyEmail.tsx

import { Resend } from "resend";
import { render } from "@react-email/components";
import { ProjectReadyEmail } from "../templates";

export interface SendProjectReadyEmailParams {
  customerEmail: string;
  customerName: string;
  planName: string;
  projectCode: string;
  finalAmount: number;
  paymentUrl: string;
}

export async function sendProjectReadyEmail(
  resend: Resend,
  params: SendProjectReadyEmailParams
): Promise<{ success: boolean; error?: string }> {
  const {
    customerEmail,
    customerName,
    planName,
    projectCode,
    finalAmount,
    paymentUrl,
  } = params;

  try {
    const html = await render(
      <ProjectReadyEmail
        customerName={customerName}
        planName={planName}
        projectCode={projectCode}
        finalAmount={finalAmount}
        customerEmail={customerEmail}
        paymentUrl={paymentUrl}
      />
    );

    const formattedAmount = (finalAmount / 100).toFixed(2);

    const { error: sendError } = await resend.emails.send({
      from: "RC Web Solutions <no-reply@rcweb.dev>",
      to: customerEmail,
      subject: `Your ${planName} project is ready! Final payment of $${formattedAmount} required`,
      html,
    });
    if (sendError) throw new Error(sendError.message);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error sending project ready email:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
