import { render } from "@react-email/components";
import {
  BlogUnsubscribeEmail,
  type BlogUnsubscribeEmailProps,
} from "../templates";
import { sendEmailWithQuota } from "@/lib/sendEmailWithQuota";

export interface SendBlogUnsubscribeEmailParams
  extends BlogUnsubscribeEmailProps {
  customerEmail: string;
}

export async function sendBlogUnsubscribeEmail(
  params: SendBlogUnsubscribeEmailParams
): Promise<{ success: boolean; error?: string }> {
  const { customerEmail, resubscribeUrl } = params;

  try {
    const html = await render(
      <BlogUnsubscribeEmail
        customerEmail={customerEmail}
        resubscribeUrl={resubscribeUrl}
      />
    );

    const result = await sendEmailWithQuota({
      from: "RC Web Solutions <no-reply@rcweb.dev>",
      to: customerEmail,
      subject: "Successfully Unsubscribed - RC Web Solutions Blog",
      html,
    });

    if (!result.success) {
      console.error(
        "❌ Error sending blog unsubscribe email via quota system:",
        result.error
      );
      return { success: false, error: result.error };
    }

    console.log("✅ Blog unsubscribe email sent to:", customerEmail);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error sending blog unsubscribe email:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
