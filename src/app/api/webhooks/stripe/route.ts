// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  console.log("🔔 WEBHOOK RECEIVED at /api/webhooks/stripe");

  // En Next.js 15, obtén el header directamente del request
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  let event: Stripe.Event;

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET || !signature) {
      console.log(
        "⚠️ No webhook secret or signature, parsing without verification"
      );
      event = JSON.parse(body) as Stripe.Event;
    } else {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    }
    console.log("✅ Event type:", event.type);
  } catch (err) {
    console.error("❌ Webhook verification failed:", err);
    return NextResponse.json(
      { error: `Webhook Error: ${err}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

<<<<<<< HEAD
=======
    console.log("💳 Session data:", {
      sessionId: session.id,
      customerEmail: session.customer_email,
      metadata: session.metadata,
    });

>>>>>>> 0ed1308 (working in send email error)
    const paymentId = session.metadata?.paymentId;
    const projectCode = session.metadata?.projectCode;
    const paymentType = session.metadata?.paymentType;
    const customerName = session.metadata?.customerName;

<<<<<<< HEAD
    if (paymentType === "initial" && paymentId) {
      // Actualizar estado del pago en BD
      const payment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          firstPaid: true,
          firstPaidAt: new Date(),
          projectStatus: "in_progress",
        },
      });

      // ENVIAR EMAIL CON EL CÓDIGO DEL PROYECTO
      await resend.emails.send({
        from: "RC Web <no-reply@rcweb.dev>",
        to: session.customer_email!,
        subject: "✅ Payment Confirmed - Your Project Code",
        html: `
          <!DOCTYPE html>
          <html>
            <body style="font-family: Arial, sans-serif; background: #1a1a1a; color: #fff; padding: 20px;">
              <div style="max-width: 600px; margin: 0 auto; background: #2a2a2a; border-radius: 10px; padding: 30px;">
                <h1 style="color: #10b981;">Payment Confirmed! ✅</h1>
                
                <p>Hi ${customerName},</p>
                
                <p>Thank you for your initial payment. We've started working on your <strong>${payment.planName}</strong> project!</p>
                
                <div style="background: #3a3a3a; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                  <p style="margin: 5px 0; font-size: 14px; color: #888;">YOUR PROJECT CODE</p>
                  <p style="font-family: monospace; font-size: 32px; color: #fbbf24; margin: 10px 0; letter-spacing: 3px;">
                    <strong>${projectCode}</strong>
                  </p>
                  <p style="margin: 5px 0; font-size: 12px; color: #888;">Save this code - you'll need it for the final payment</p>
                </div>
                
                <h3 style="color: #fbbf24;">What happens next?</h3>
                <ol style="line-height: 1.8;">
                  <li>We'll contact you within 24 hours to discuss project details</li>
                  <li>Project development will take ${payment.planName === "Starter" ? "2-3 weeks" : payment.planName === "Growth" ? "3-5 weeks" : "6-8 weeks"}</li>
                  <li>Once complete, we'll notify you for the final payment</li>
                  <li>After final payment, you'll receive all deliverables</li>
                </ol>
                
                <div style="background: #1e3a5f; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 5px 0;"><strong>💡 Important Information:</strong></p>
                  <p style="margin: 10px 0; font-size: 14px;">
                    When your project is ready, you'll need to make the final payment at:<br>
                    <a href="https://rcweb.dev/final-payment" style="color: #fbbf24;">rcweb.dev/final-payment</a>
                  </p>
                  <p style="margin: 10px 0; font-size: 14px;">
                    You'll need:<br>
                    • This email address: ${session.customer_email}<br>
                    • Your project code: <strong>${projectCode}</strong>
                  </p>
                </div>
                
                <div style="background: #2a2a2a; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h4 style="color: #fbbf24; margin-top: 0;">Payment Summary</h4>
                  <table style="width: 100%; font-size: 14px;">
                    <tr>
                      <td style="padding: 5px 0;">Initial Payment (50%):</td>
                      <td style="text-align: right; color: #10b981;">✅ $${(payment.firstPayment / 100).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 5px 0;">Final Payment (50%):</td>
                      <td style="text-align: right;">Pending $${(payment.secondPayment / 100).toFixed(2)}</td>
                    </tr>
                    <tr style="border-top: 1px solid #444;">
                      <td style="padding: 5px 0; font-weight: bold;">Total Project Cost:</td>
                      <td style="text-align: right; font-weight: bold;">$${(payment.totalAmount / 100).toFixed(2)}</td>
                    </tr>
                  </table>
                </div>
                
                <hr style="border: 1px solid #444; margin: 20px 0;">
                
                <p style="color: #888; font-size: 12px;">
                  Questions? Reply to this email or contact us at support@rcweb.dev<br>
                  Save this email for your records.
                </p>
              </div>
            </body>
          </html>
        `,
=======
    if (paymentType === "initial" && paymentId && projectCode) {
      try {
        // Actualizar BD
        const payment = await prisma.payment.update({
          where: { id: paymentId },
          data: {
            firstPaid: true,
            firstPaidAt: new Date(),
            projectStatus: "in_progress",
          },
        });
        console.log("✅ DB updated for payment:", paymentId);

        // Enviar email
        console.log("📧 Attempting to send email to:", session.customer_email);

        try {
          const emailResult = await resend.emails.send({
            from: "no-reply@rcweb.dev",
            to: [session.customer_email!], // Usa array como en tu ejemplo que funciona
            subject: "✅ Payment Confirmed - Your Project Code",
            text: `Your project code is: ${projectCode}`, // Agrega versión de texto
            html: `
              <!DOCTYPE html>
              <html>
                <body style="font-family: Arial, sans-serif;">
                  <h2>Payment Confirmed! ✅</h2>
                  <p>Hi ${customerName || "Customer"},</p>
                  <p>Project Code: <strong style="font-size: 24px; color: #f59e0b;">${projectCode}</strong></p>
                  <p>Plan: ${payment.planName}</p>
                  <p>Payment: $${(payment.firstPayment / 100).toFixed(2)}</p>
                  <p>Save this code for your final payment at: https://rcweb.dev/final-payment</p>
                </body>
              </html>
            `,
          });

          console.log("✅ Email sent:", emailResult);
        } catch (emailError) {
          console.error("❌ Email error:", emailError);
        }
      } catch (dbError) {
        console.error("❌ Database error:", dbError);
      }
    } else {
      console.log("⏭️ Skipping email - missing data:", {
        hasPaymentType: !!paymentType,
        isInitial: paymentType === "initial",
        hasPaymentId: !!paymentId,
        hasProjectCode: !!projectCode,
>>>>>>> 0ed1308 (working in send email error)
      });
    }
  }

  return NextResponse.json({ received: true });
}
