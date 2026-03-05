import { Resend } from "resend";
import { render } from "@react-email/render";
import NewLeadNotificationEmail from "../templates/NewLeadNotificationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "contactus@rcweb.dev";

interface SendNewLeadNotificationParams {
  leadName: string;
  leadEmail?: string;
  leadPhone?: string;
  source: string;
  message?: string;
}

export async function sendNewLeadNotification({
  leadName,
  leadEmail,
  leadPhone,
  source,
  message,
}: SendNewLeadNotificationParams): Promise<{ success: boolean; error?: string }> {
  try {
    const createdAt = new Date().toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/Chicago",
    });

    const emailHtml = await render(
      NewLeadNotificationEmail({
        leadName,
        leadEmail,
        leadPhone,
        source,
        message,
        createdAt,
      })
    );

    const sourceLabels: Record<string, string> = {
      contact_form: "Contact Form",
      guide_download: "Guide Download",
      blog_subscription: "Blog Subscription",
      sms_opt_in: "SMS",
      exit_intent: "Exit Intent",
    };

    const sourceLabel = sourceLabels[source] || source;

    const { error } = await resend.emails.send({
      from: "RC Web CRM <crm@rcweb.dev>",
      to: ADMIN_EMAIL,
      subject: `🔔 New Lead: ${leadName} (${sourceLabel})`,
      html: emailHtml,
    });

    if (error) {
      console.error("Error sending lead notification:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in sendNewLeadNotification:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
