// src/lib/email/senders/sendWelcomeEmail.tsx

import { render } from "@react-email/components";
import { WelcomeEmail, type WelcomeEmailProps } from "../templates";
import { sendEmailWithQuota } from "@/lib/sendEmailWithQuota";

export interface SendWelcomeEmailParams extends WelcomeEmailProps {
  customerEmail: string;
}

export async function sendWelcomeEmail(
  params: SendWelcomeEmailParams
): Promise<{ success: boolean; error?: string }> {
  const { customerEmail, customerName, loginUrl } = params;

  try {
    const html = await render(
      <WelcomeEmail customerName={customerName} loginUrl={loginUrl} />
    );

    const result = await sendEmailWithQuota({
      from: "RC Web Solutions <no-reply@rcweb.dev>",
      to: customerEmail,
      subject: "Welcome to RC Web Solutions Client Portal",
      html,
    });

    if (result.success) {
      console.log("✅ Welcome email sent to:", customerEmail);
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error sending welcome email:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
