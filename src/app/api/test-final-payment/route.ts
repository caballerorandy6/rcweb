// app/api/test-final-email/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectCode = searchParams.get("code") || "UUPA26";
  const testEmail = searchParams.get("email");
  
  console.log("🧪 Testing final payment email for project:", projectCode);
  
  try {
    // Buscar el payment
    const payment = await prisma.payment.findUnique({
      where: { projectCode }
    });

    if (!payment) {
      return NextResponse.json({
        error: "Payment not found",
        projectCode
      });
    }

    const customerEmail = testEmail || payment.email;
    
    console.log("📧 Sending test email to:", customerEmail);
    console.log("💾 Payment data:", {
      name: payment.name,
      planName: payment.planName,
      secondPayment: payment.secondPayment,
      totalAmount: payment.totalAmount
    });

    const resend = new Resend(process.env.RESEND_API_KEY!);

    // Definir entregables
    const deliverables = {
      Starter: ["Source code", "Deployment", "30 days support"],
      Growth: ["Source code", "Deployment", "60 days support", "SEO"],
      Premium: ["Source code", "Multi-env deployment", "90 days support", "SEO", "Performance"],
      "Test Plan": ["Test deliverable 1", "Test deliverable 2"]
    };

    const planDeliverables = deliverables[payment.planName as keyof typeof deliverables] || 
                            ["Standard deliverables"];

    // Intentar enviar el email
    try {
      const result = await resend.emails.send({
        from: "RC Web <no-reply@rcweb.dev>",
        to: customerEmail,
        subject: `🎉 TEST - Project Complete - ${payment.planName}!`,
        html: `
          <!DOCTYPE html>
          <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
              <div style="max-width: 600px; margin: 0 auto; background: white; border: 1px solid #ddd; border-radius: 10px; padding: 30px;">
                <h1 style="color: #10b981;">🎉 Project Complete!</h1>
                
                <p>Hi ${payment.name},</p>
                
                <p>This is a TEST email for your final payment confirmation.</p>
                
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3>Project Details:</h3>
                  <ul>
                    <li>Project Code: <strong>${projectCode}</strong></li>
                    <li>Plan: <strong>${payment.planName}</strong></li>
                    <li>Final Payment: <strong>$${(payment.secondPayment / 100).toFixed(2)}</strong></li>
                    <li>Total Value: <strong>$${(payment.totalAmount / 100).toFixed(2)}</strong></li>
                  </ul>
                </div>
                
                <div style="background: #ede9fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3>Deliverables:</h3>
                  <ul>
                    ${planDeliverables.map(item => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                  This is a test email. If you received this, the email system is working correctly.
                </p>
              </div>
            </body>
          </html>
        `,
      });

      console.log("✅ Email sent successfully:", result);

      return NextResponse.json({
        success: true,
        message: "Test email sent successfully",
        emailId: result.data?.id,
        to: customerEmail,
        payment: {
          name: payment.name,
          planName: payment.planName,
          projectCode: payment.projectCode,
          secondPayment: payment.secondPayment,
          secondPaid: payment.secondPaid
        }
      });

    } catch (emailError: unknown) {
      console.error("❌ Email error:", emailError);
      return NextResponse.json({
        success: false,
        error: "Email failed to send",
        details: typeof emailError === "object" && emailError !== null && "message" in emailError
          ? (emailError as { message?: string }).message
          : "Unknown error",
        resendConfigured: !!process.env.RESEND_API_KEY,
        from: "no-reply@rcweb.dev",
        to: customerEmail
      });
    }

  } catch (error: unknown) {
    console.error("❌ General error:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to process test",
      details: typeof error === "object" && error !== null && "message" in error
        ? (error as { message?: string }).message
        : "Unknown error"
    });
  }
}