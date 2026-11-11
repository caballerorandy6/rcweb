import { Resend } from "resend";
import { render } from "@react-email/components";
import { PaymentIssueAdminEmail, type PaymentIssueAdminEmailProps } from "../templates";
import { ADMIN_EMAIL } from "../adminEmail";

const SUBJECTS: Record<PaymentIssueAdminEmailProps["kind"], string> = {
  refund: "Refund issued",
  dispute_opened: "Payment disputed, response needed",
  dispute_won: "Dispute won",
  dispute_lost: "Dispute lost",
};

/** Tells the admin about a refund or a dispute on a project charge; never throws */
export async function sendAdminPaymentIssueNotification(
  resend: Resend,
  props: PaymentIssueAdminEmailProps
): Promise<{ success: boolean; error?: string }> {
  try {
    const html = await render(<PaymentIssueAdminEmail {...props} />);
    const { error: sendError } = await resend.emails.send({
      from: "RC Web Solutions <no-reply@rcweb.dev>",
      to: ADMIN_EMAIL,
      subject: `${SUBJECTS[props.kind]} - ${props.projectCode} - ${props.customerName}`,
      html,
    });
    if (sendError) throw new Error(sendError.message);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error sending payment issue notification:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
