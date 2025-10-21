import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const body = await request.json();
  const { name, email, phone, message } = body;

  try {
    const data = await resend.emails.send({
      from: "RC Web <no-reply@rcweb.dev>",
      to: ["admin@rcweb.dev"],
      subject: `📩 New message from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;box-shadow:0 4px 6px rgba(0,0,0,0.1);overflow:hidden;">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background:linear-gradient(135deg,#6366f1 0%,#7c3aed 100%);padding:40px 32px;text-align:center;">
                        <div style="display:inline-block;background:rgba(255,255,255,0.2);border-radius:50%;padding:16px;margin-bottom:16px;">
                          <!-- Envelope Icon -->
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 4h16v16H4z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                          </svg>
                        </div>
                        <h1 style="color:#fff;margin:0;font-size:28px;font-weight:700;">New Website Message</h1>
                        <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:16px;">A new inquiry was submitted through the contact form</p>
                      </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td style="padding:32px;">
                        <p style="font-size:16px;color:#374151;margin:0 0 24px;">You have received a new message from your website contact form:</p>

                        <!-- Info Box -->
                        <div style="background-color:#f9fafb;border-radius:12px;padding:24px;margin-bottom:32px;">
                          <table style="width:100%;font-size:14px;">
                            <tr>
                              <td style="color:#6b7280;padding:6px 0;">Name:</td>
                              <td style="text-align:right;font-weight:600;color:#374151;">${name}</td>
                            </tr>
                            <tr>
                              <td style="color:#6b7280;padding:6px 0;">Email:</td>
                              <td style="text-align:right;font-weight:600;color:#374151;">${email}</td>
                            </tr>
                            <tr>
                              <td style="color:#6b7280;padding:6px 0;">Phone:</td>
                              <td style="text-align:right;font-weight:600;color:#374151;">${phone || "Not provided"}</td>
                            </tr>
                          </table>
                        </div>

                        <!-- Message -->
                        <div style="background:linear-gradient(135deg,#ede9fe 0%,#ddd6fe 100%);border-left:4px solid #7c3aed;border-radius:8px;padding:20px;margin-bottom:32px;">
                          <p style="color:#5b21b6;font-weight:600;font-size:16px;margin:0 0 12px;">Message:</p>
                          <p style="color:#374151;font-size:14px;line-height:1.6;margin:0;">${message}</p>
                        </div>

                        <!-- Footer -->
                        <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;">
                        <p style="text-align:center;color:#6b7280;font-size:14px;margin:0;">
                          Reply directly to <a href="mailto:${email}" style="color:#7c3aed;text-decoration:none;">${email}</a> to respond to this message.
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error sending contact email:", error);
    return NextResponse.json({ success: false, error });
  }
}
