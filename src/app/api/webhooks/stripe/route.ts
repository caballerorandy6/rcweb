import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook Error: ${err}` },
      { status: 400 }
    );
  }

  console.log("🔔 Webhook recibido:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const paymentId = session.metadata?.paymentId;
    const projectCode = session.metadata?.projectCode;
    const paymentType = session.metadata?.paymentType;
    const customerName = session.metadata?.customerName;
    const planName = session.metadata?.planName;
    const customerEmail =
      session.customer_email || session.metadata?.customerEmail;

    console.log("📋 Metadata recibido:", {
      paymentType,
      paymentId,
      projectCode,
      customerEmail,
    });

    const resend = new Resend(process.env.RESEND_API_KEY!);

    // ============= PAGO INICIAL =============
    if (paymentType === "initial" && paymentId && customerEmail) {
      try {
        await prisma.payment.update({
          where: { id: paymentId },
          data: {
            firstPaid: true,
            firstPaidAt: new Date(),
            projectStatus: "in_progress",
          },
        });

        await resend.emails.send({
          from: "RC Web <no-reply@rcweb.dev>",
          to: customerEmail,
          subject: `✅ Payment Confirmed - Your Project Code`,
          html: `
            <!DOCTYPE html>
            <html>
              <body style="font-family: Arial, sans-serif; background: #1a1a1a; color: #fff; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: #2a2a2a; border-radius: 10px; padding: 30px;">
                  <h1 style="color: #10b981;">Payment Confirmed! ✅</h1>
                  <p>Hi ${customerName || "Client"},</p>
                  <p>Thank you for your initial payment. We've started working on your <strong>${planName}</strong> project!</p>
                  
                  <div style="background: #3a3a3a; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                    <p style="margin: 5px 0; font-size: 14px; color: #888;">YOUR PROJECT CODE</p>
                    <p style="font-family: monospace; font-size: 32px; color: #fbbf24; margin: 10px 0; letter-spacing: 3px;">
                      <strong>${projectCode}</strong>
                    </p>
                    <p style="margin: 5px 0; font-size: 12px; color: #888;">Save this code - you'll need it for the final payment</p>
                  </div>

                  <h3 style="color: #fbbf24;">What happens next?</h3>
                  <ol style="line-height: 1.8;">
                    <li>We'll contact you within 24 hours</li>
                    <li>Project development time based on your plan</li>
                    <li>Final payment required upon completion</li>
                    <li>All deliverables after final payment</li>
                  </ol>

                  <div style="background: #1e3a5f; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>💡 Final Payment Info:</strong></p>
                    <p>Visit: <a href="https://rcweb.dev/final-payment" style="color: #fbbf24;">rcweb.dev/final-payment</a></p>
                    <p>You'll need this email and code: <strong>${projectCode}</strong></p>
                  </div>
                </div>
              </body>
            </html>
          `,
        });

        console.log("✅ Email inicial enviado");
      } catch (err) {
        console.error("Error procesando pago inicial:", err);
      }
    }
    // ============= PAGO FINAL - ESTA PARTE FALTA EN TU WEBHOOK =============
    else if (paymentType === "final" && paymentId && customerEmail) {
      console.log("💰 Procesando PAGO FINAL");

      try {
        // Buscar el payment para obtener todos los datos
        const payment = await prisma.payment.findUnique({
          where: { id: paymentId },
        });

        if (!payment) {
          console.error("Payment no encontrado:", paymentId);
          return NextResponse.json({ received: true });
        }

        // Actualizar como pagado completamente
        await prisma.payment.update({
          where: { id: paymentId },
          data: {
            secondPaid: true,
            secondPaidAt: new Date(),
            projectStatus: "completed",
          },
        });

        console.log("✅ Base de datos actualizada - Proyecto completado");

        // Enviar email de proyecto completado
        await resend.emails.send({
          from: "RC Web <no-reply@rcweb.dev>",
          to: customerEmail,
          subject: `🎉 Project Complete - ${payment.planName} Website Ready!`,
          html: `
            <!DOCTYPE html>
            <html>
              <body style="font-family: Arial, sans-serif; background: #f4f4f5; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px;">
                  <h1 style="color: #10b981;">🎉 Project Complete!</h1>
                  
                  <p>Hi ${payment.name},</p>
                  
                  <p>Your project has been successfully completed and your final payment of 
                  <strong>$${(payment.secondPayment / 100).toFixed(2)}</strong> has been received.</p>
                  
                  <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>Project Summary</h3>
                    <p>Project Code: <strong>${projectCode}</strong></p>
                    <p>Plan: <strong>${payment.planName}</strong></p>
                    <p>Total Investment: <strong>$${(payment.totalAmount / 100).toFixed(2)}</strong></p>
                    <p>Status: <strong>✓ Complete & Delivered</strong></p>
                  </div>
                  
                  <div style="background: #ede9fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>What's Next?</h3>
                    <ol>
                      <li>Check your email for repository access</li>
                      <li>Review the documentation</li>
                      <li>Schedule your training session</li>
                      <li>Contact us for support</li>
                    </ol>
                  </div>
                  
                  <p>Thank you for choosing RC Web!</p>
                  
                  <hr style="margin: 30px 0;">
                  <p style="text-align: center; color: #6b7280;">
                    Need help? Contact us at <a href="mailto:support@rcweb.dev">support@rcweb.dev</a>
                  </p>
                </div>
              </body>
            </html>
          `,
        });

        console.log("✅ Email de pago final enviado a:", customerEmail);

        // También enviar notificación al admin
        await resend.emails.send({
          from: "RC Web <no-reply@rcweb.dev>",
          to: "admin@rcweb.dev",
          subject: `💰 Final Payment Received - ${payment.planName} - ${projectCode}`,
          html: `
            <h2>Final Payment Completed ✅</h2>
            <p><strong>Client:</strong> ${payment.name} (${customerEmail})</p>
            <p><strong>Project Code:</strong> ${projectCode}</p>
            <p><strong>Plan:</strong> ${payment.planName}</p>
            <p><strong>Final Payment:</strong> $${(payment.secondPayment / 100).toFixed(2)}</p>
            <p><strong>Total Project Value:</strong> $${(payment.totalAmount / 100).toFixed(2)}</p>
            <p>Remember to send repository access and schedule training!</p>
          `,
        });

        console.log("✅ Email al admin enviado");
      } catch (err) {
        console.error("❌ Error procesando pago final:", err);
      }
    }
    // Si no es ni initial ni final
    else {
      console.log("⚠️ Condiciones no cumplidas:");
      console.log("- paymentType:", paymentType);
      console.log("- paymentId:", paymentId);
      console.log("- customerEmail:", customerEmail);
    }
  }

  return NextResponse.json({ received: true });
}
