// src/lib/email/senders/sendProjectReadyEmail.tsx

import { Resend } from "resend";
import { render } from "@react-email/components";
import * as React from "react";
import { ProjectReadyEmail } from "../templates";

export interface SendProjectReadyEmailParams {
  customerEmail: string;
  customerName: string;
  planName: string;
  projectCode: string;
  finalAmount: number;
}

export async function sendProjectReadyEmail(
  resend: Resend,
  params: SendProjectReadyEmailParams
): Promise<{ success: boolean; error?: string }> {
  const { customerEmail, customerName, planName, projectCode, finalAmount } =
    params;

  try {
    const html = await render(
      <ProjectReadyEmail
        customerName={customerName}
        planName={planName}
        projectCode={projectCode}
        finalAmount={finalAmount}
        customerEmail={customerEmail}
      />
    );

    const formattedAmount = (finalAmount / 100).toFixed(2);

    await resend.emails.send({
      from: "RC Web <no-reply@rcweb.dev>",
      to: customerEmail,
      subject: `Your ${planName} project is ready! Final payment of $${formattedAmount} required`,
      html,
    });

    console.log(`✅ Project ready email sent to ${customerEmail}`);
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.error("❌ Error sending project ready email:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
