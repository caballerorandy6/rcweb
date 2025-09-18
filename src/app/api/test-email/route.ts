// app/api/test-email/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
  console.log(
    "Testing email with key:",
    process.env.RESEND_API_KEY?.slice(0, 10) + "..."
  );

  const resend = new Resend(process.env.RESEND_API_KEY!);

  try {
    const result = await resend.emails.send({
      from: "no-reply@rcweb.dev",
      to: ["caballerorandy7@gmail.com"], // Cambia esto
      subject: "Test from Webhook Context",
      text: "Testing email from webhook context",
      html: "<p>Testing email from webhook context</p>",
    });

    return NextResponse.json({ success: true, emailId: result.data?.id });
  } catch (error) {
    console.error("Email test failed:", error);
    return NextResponse.json({ success: false, error: String(error) });
  }
}
