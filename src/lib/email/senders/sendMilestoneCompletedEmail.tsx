// src/lib/email/senders/sendMilestoneCompletedEmail.tsx

import { render } from "@react-email/components";
import { MilestoneCompletedEmail, type MilestoneCompletedEmailProps } from "../templates";
import { ADMIN_EMAIL } from "../adminEmail";
import { sendEmailWithQuota } from "@/lib/sendEmailWithQuota";

export interface SendMilestoneCompletedEmailParams extends MilestoneCompletedEmailProps {
  customerEmail: string;
}

/** Tells the customer a milestone is done, with their link to /project/[token]. Fails when the daily quota is gone. */
export async function sendMilestoneCompletedEmail(
  params: SendMilestoneCompletedEmailParams
): Promise<{ success: boolean; error?: string }> {
  const { customerEmail, ...props } = params;

  try {
    const html = await render(<MilestoneCompletedEmail {...props} />);

    const result = await sendEmailWithQuota(
      {
        from: "RC Web Solutions <contactus@rcweb.dev>",
        to: customerEmail,
        // "Just reply to this email" must reach the monitored inbox
        replyTo: ADMIN_EMAIL,
        subject: `Milestone completed: ${props.milestoneTitle} · Project ${props.projectCode}`,
        html,
      },
      { failOnQuotaExceeded: true }
    );

    return result.success ? { success: true } : { success: false, error: result.error };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error sending milestone completed email:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
