// app/api/admin/projects/update-status/route.ts
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
        subject: "🎉 Your project is ready! Final payment required",
        html: `
          <!DOCTYPE html>
          <html>
            <body style="font-family: Arial, sans-serif; background: #1a1a1a; color: #fff; padding: 20px;">
              <div style="max-width: 600px; margin: 0 auto; background: #2a2a2a; border-radius: 10px; padding: 30px;">
                <h1 style="color: #fbbf24;">Your Project is Complete! 🎉</h1>
                
                <p>Hi ${payment.name},</p>
                
                <p>Great news! Your <strong>${payment.planName}</strong> project is complete and ready for final review.</p>
                
                <div style="background: #3a3a3a; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 5px 0;"><strong>Project Code:</strong> <span style="font-family: monospace; font-size: 20px; color: #fbbf24;">${payment.projectCode}</span></p>
                  <p style="margin: 5px 0;"><strong>Final Payment Due:</strong> <span style="font-size: 24px; color: #fbbf24;">$${finalAmount}</span></p>
                </div>
                
                <p><strong>How to complete your payment:</strong></p>
                <ol>
                  <li>Visit: <a href="https://rcweb.dev/final-payment" style="color: #fbbf24;">https://rcweb.dev/final-payment</a></li>
                  <li>Enter your email: ${payment.email}</li>
                  <li>Enter your project code: ${payment.projectCode}</li>
                  <li>Complete the secure payment via Stripe</li>
                </ol>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://rcweb.dev/final-payment" style="background: #fbbf24; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                    Make Final Payment
                  </a>
                </div>
                
                <p style="color: #888; font-size: 12px;">Once payment is complete, you'll receive all project files, documentation, and access credentials.</p>
                
                <hr style="border: 1px solid #444; margin: 20px 0;">
                
                <p style="color: #888; font-size: 12px;">Need help? Reply to this email or contact us at support@rcweb.dev</p>
              </div>
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
