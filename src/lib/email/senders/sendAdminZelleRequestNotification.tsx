import { Resend } from "resend";
import { render } from "@react-email/components";
import { ZelleRequestAdminEmail, type ZelleRequestAdminEmailProps } from "../templates";
import { ADMIN_EMAIL } from "../adminEmail";

/** Tells the admin a customer chose Zelle for a quote deposit; never throws */
export async function sendAdminZelleRequestNotification(
  resend: Resend,
  props: ZelleRequestAdminEmailProps
): Promise<{ success: boolean; error?: string }> {
  try {
    const html = await render(<ZelleRequestAdminEmail {...props} />);
    const { error: sendError } = await resend.emails.send({
      from: "RC Web Solutions <no-reply@rcweb.dev>",
      to: ADMIN_EMAIL,
      subject: `Zelle deposit coming for quote ${props.quoteNumber} - ${props.customerName}`,
      html,
    });
    if (sendError) throw new Error(sendError.message);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error sending Zelle request notification:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
