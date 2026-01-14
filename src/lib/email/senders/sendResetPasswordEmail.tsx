import { render } from "@react-email/components";
import { ResetPasswordEmail, type ResetPasswordEmailProps } from "../templates";
import { sendEmailWithQuota } from "@/lib/sendEmailWithQuota";

export interface SendResetPasswordEmailParams extends ResetPasswordEmailProps {
  customerEmail: string;
}

export async function sendResetPasswordEmail(
  params: SendResetPasswordEmailParams
): Promise<{ success: boolean; error?: string }> {
  const { customerEmail, customerName, resetPasswordUrl } = params;

  try {
    const html = await render(
      <ResetPasswordEmail
        customerName={customerName}
        resetPasswordUrl={resetPasswordUrl}
      />
    );

    const result = await sendEmailWithQuota({
      from: "RC Web Solutions <no-reply@rcweb.dev>",
      to: customerEmail,
      subject: `Reset Your Password - RC Web Solutions`,
      html,
    });

    if (!result.success) {
      console.error(
        "❌ Error sending reset password email via quota system:",
        result.error
      );
      return { success: false, error: result.error };
    }

    console.log("✅ Reset password email sent to:", customerEmail);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error sending reset password email:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
