// src/lib/email/senders/sendContactConfirmationEmail.tsx

import { render } from "@react-email/components";
import {
  ContactConfirmationEmail,
  type ContactConfirmationEmailProps,
} from "../templates";
import { ADMIN_EMAIL } from "../adminEmail";
import { sendEmailWithQuota } from "@/lib/sendEmailWithQuota";

export interface SendContactConfirmationEmailParams
  extends Omit<ContactConfirmationEmailProps, "siteUrl"> {
  customerEmail: string;
}

export async function sendContactConfirmationEmail(
  params: SendContactConfirmationEmailParams
): Promise<{ success: boolean; error?: string }> {
  const { customerEmail, customerName } = params;
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://rcweb.dev";

  try {
    const html = await render(
      <ContactConfirmationEmail customerName={customerName} siteUrl={siteUrl} />
    );

    const result = await sendEmailWithQuota({
      from: "RC Web Solutions <contactus@rcweb.dev>",
      to: customerEmail,
      // Replies must land in the inbox that is actually monitored.
      replyTo: ADMIN_EMAIL,
      subject: "Got your message! - RC Web Solutions",
      html,
    });

    if (result.success) {
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error sending contact confirmation email:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
