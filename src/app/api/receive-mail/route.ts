import { NextResponse } from "next/server";
import { Resend } from "resend";

console.log("API KEY:", process.env.RESEND_API_KEY);
export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const body = await request.json();
  const { name, email, phone, message } = body;

  try {
    const data = await resend.emails.send({
      from: "RC Web <no-reply@rcweb.dev>",
      to: ["caballerorandy7@gmail.com"],
      subject: `New message from ${name}`,
      text: `You have received a new message from ${name} (${email}, ${phone}): ${message}`,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
