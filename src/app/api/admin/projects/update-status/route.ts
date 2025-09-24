import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  const { projectCode, status } = await req.json();

  try {
    // Actualizar estado en BD
    const payment = await prisma.payment.update({
      where: { projectCode },
      data: {
        projectStatus: status,
        projectReady: status === "ready_for_payment" ? new Date() : undefined,
      },
    });

    // Si está listo, enviar email automáticamente
    if (status === "ready_for_payment") {
      const finalAmount = (payment.secondPayment / 100).toFixed(2);

      await resend.emails.send({
        from: "RC Web <no-reply@rcweb.dev>",
        to: payment.email,
        subject: `🎉 Your ${payment.planName} project is ready! Final payment of $${finalAmount} required`,
        html: `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f3f4f6;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 48px 32px; text-align: center;">
                  <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); border-radius: 50%; padding: 16px; margin-bottom: 16px;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                      <path d="M6 2v7"></path>
                      <path d="M18 2v7"></path>
                      <path d="M6 9a6 6 0 0 0 12 0"></path>
                      <path d="M12 15v6"></path>
                      <path d="M9 21h6"></path>
                    </svg>
                  </div>
                  <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">Your Project is Ready!</h1>
                  <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Final payment required to deliver</p>
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding: 40px 32px;">
                  <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                    Hi <strong>${payment.name}</strong>,
                  </p>
                  
                  <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                    Great news! Your <strong>${payment.planName}</strong> project is complete and ready for final review.
                  </p>
                  
                  <!-- Project Summary -->
                  <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin: 0 0 32px 0;">
                    <h3 style="color: #111827; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                      Project Summary
                    </h3>
                    <table style="width: 100%; font-size: 14px;">
                      <tr>
                        <td style="padding: 6px 0; color: #6b7280;">Project Code:</td>
                        <td style="text-align: right; font-weight: 600; color: #374151; font-family: 'Courier New', monospace;">${payment.projectCode}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #6b7280;">Plan:</td>
                        <td style="text-align: right; font-weight: 600; color: #374151;">${payment.planName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #6b7280;">Final Payment Due:</td>
                        <td style="text-align: right; font-weight: 600; color: #059669; font-size: 16px;">$${finalAmount}</td>
                      </tr>
                    </table>
                  </div>
                  
                  <!-- Payment Instructions -->
                  <div style="background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); border-left: 4px solid #7c3aed; border-radius: 8px; padding: 20px; margin: 0 0 32px 0;">
                    <p style="margin: 0 0 12px 0; color: #5b21b6; font-weight: 600; font-size: 16px;">
                      Complete Your Final Payment
                    </p>
                    <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px;">
                      You can complete your payment directly:
                    </p>
                    <div style="text-align:center; margin:20px 0">
                      <a href="https://rcweb.dev/final-payment" target="_blank" rel="noopener noreferrer"
                        style="background:#7c3aed; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:600;">
                        Complete Final Payment Now
                      </a>
                    </div>
                    <p style="margin: 0; color: #4b5563; font-size: 14px;">
                      Or visit <a href="https://rcweb.dev/final-payment" target="_blank" rel="noopener noreferrer" style="color: #7c3aed; text-decoration: none;">rcweb.dev/final-payment</a> 
                      and use your email <strong>${payment.email}</strong> and project code <strong>${payment.projectCode}</strong>.
                    </p>
                  </div>
                  
                  <!-- Thank You -->
                  <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 32px 0;">
                    <p style="color: #92400e; font-size: 18px; font-weight: 600; margin: 0;">
                      Thank you for choosing RC Web!
                    </p>
                    <p style="color: #b45309; font-size: 14px; margin: 8px 0 0 0;">
                      We're excited to deliver your new website once payment is completed.
                    </p>
                  </div>
                  
                  <!-- Footer -->
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
                  <p style="text-align: center; color: #6b7280; font-size: 14px; margin: 0;">
                    Questions? Contact us at <a href="mailto:contactus@rcweb.dev" style="color: #7c3aed; text-decoration: none;">contactus@rcweb.dev</a>
                  </p>
                  
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
                  <p style="text-align: center; color: #6b7280; font-size: 12px;">
                    You can unsubscribe from marketing emails at any time by clicking
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${encodeURIComponent(payment.email)}" style="color: #7c3aed; text-decoration: none;">
                    here
                  </a>.
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
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
