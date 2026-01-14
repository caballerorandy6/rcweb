import { render } from "@react-email/components";
import {
  NewAdminMessageEmail,
  type NewAdminMessageEmailProps,
} from "../templates";
import { sendEmailWithQuota } from "@/lib/sendEmailWithQuota";

export interface SendNewAdminMessageEmailParams
  extends NewAdminMessageEmailProps {
  customerEmail: string;
}

export async function sendNewAdminMessageEmail(
  params: SendNewAdminMessageEmailParams
): Promise<{ success: boolean; error?: string }> {
  const {
    customerEmail,
    customerName,
    projectCode,
    planName,
    message,
    clientPortalUrl,
  } = params;

  try {
    const html = await render(
      <NewAdminMessageEmail
        customerName={customerName}
        projectCode={projectCode}
        planName={planName}
        message={message}
        clientPortalUrl={clientPortalUrl}
      />
    );

    const result = await sendEmailWithQuota({
      from: "RC Web Solutions <no-reply@rcweb.dev>",
      to: customerEmail,
      subject: `Update on Your Project ${projectCode} - RC Web Solutions`,
      html,
    });

    if (!result.success) {
      console.error(
        "❌ Error sending new admin message email via quota system:",
        result.error
      );
      return { success: false, error: result.error };
    }

    console.log("✅ New admin message email sent to client:", customerEmail);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error sending new admin message email:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
