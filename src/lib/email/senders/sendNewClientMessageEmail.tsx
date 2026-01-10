import { render } from "@react-email/components";
import {
  NewClientMessageEmail,
  type NewClientMessageEmailProps,
} from "../templates";
import { sendEmailWithQuota } from "@/lib/sendEmailWithQuota";

export interface SendNewClientMessageEmailParams
  extends NewClientMessageEmailProps {
  adminEmail: string;
}

export async function sendNewClientMessageEmail(
  params: SendNewClientMessageEmailParams
): Promise<{ success: boolean; error?: string }> {
  const {
    adminEmail,
    clientName,
    clientEmail,
    projectCode,
    planName,
    message,
    adminPanelUrl,
  } = params;

  try {
    const html = await render(
      <NewClientMessageEmail
        clientName={clientName}
        clientEmail={clientEmail}
        projectCode={projectCode}
        planName={planName}
        message={message}
        adminPanelUrl={adminPanelUrl}
      />
    );

    const result = await sendEmailWithQuota({
      from: "RC Web <no-reply@rcweb.dev>",
      to: adminEmail,
      subject: `New Message from ${clientName} - Project ${projectCode}`,
      html,
      replyTo: clientEmail,
    });

    if (!result.success) {
      console.error(
        "❌ Error sending new client message email via quota system:",
        result.error
      );
      return { success: false, error: result.error };
    }

    console.log("✅ New client message email sent to admin:", adminEmail);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error sending new client message email:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
