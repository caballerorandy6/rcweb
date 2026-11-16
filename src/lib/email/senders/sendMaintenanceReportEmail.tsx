// src/lib/email/senders/sendMaintenanceReportEmail.tsx

import { emailTranslator, formatMonth } from "../i18n";
import { render } from "@react-email/components";
import { MaintenanceReportEmail, type MaintenanceReportEmailProps } from "../templates";
import { ADMIN_EMAIL } from "../adminEmail";
import { sendEmailWithQuota } from "@/lib/sendEmailWithQuota";

export interface SendMaintenanceReportEmailParams extends MaintenanceReportEmailProps {
  customerEmail: string;
}

/** Sends a maintenance customer the report of one month. Fails when the daily quota is gone. */
export async function sendMaintenanceReportEmail(
  params: SendMaintenanceReportEmailParams
): Promise<{ success: boolean; error?: string }> {
  const { customerEmail, ...props } = params;

  try {
    const html = await render(<MaintenanceReportEmail {...props} />);

    const result = await sendEmailWithQuota(
      {
        from: "RC Web Solutions <contactus@rcweb.dev>",
        to: customerEmail,
        // "Just reply to this email" must reach the monitored inbox
        replyTo: ADMIN_EMAIL,
        subject: emailTranslator(props.locale)("maintenanceReport.subject", {
          month: formatMonth(props.month, props.locale),
        }),
        html,
      },
      { failOnQuotaExceeded: true }
    );

    return result.success ? { success: true } : { success: false, error: result.error };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error sending maintenance report email:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
