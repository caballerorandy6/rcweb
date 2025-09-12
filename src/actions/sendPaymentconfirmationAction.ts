"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendPaymentConfirmationAction(email: string) {
  try {
    await resend.emails.send({
      from: "no-reply@rcweb.dev",
      to: email,
      subject: "Payment Confirmation - RC Web",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.5; color:#333;">
          <h2 style="color:#0f172a;">Thank you for your payment!</h2>
          <p>Your checkout has been completed successfully.</p>
          <p>We are excited to start working on your project 🚀</p>
          <p>You will receive the next steps shortly from our team.</p>
          <br/>
          <p style="font-size:14px; color:#64748b;">Best regards,<br/>RC Web Team</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error: "Failed to send email" };
  }
}
