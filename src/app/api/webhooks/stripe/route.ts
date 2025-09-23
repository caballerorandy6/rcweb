import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.error("❌ Error verificando webhook:", err);
    return NextResponse.json(
      { error: `Webhook Error: ${err}` },
      { status: 400 }
    );
  }

  console.log("🔔 Webhook recibido:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("➡️ Metadata recibida:", session.metadata);
    console.log("📧 Email en session:", session.customer_email);

    const paymentId = session.metadata?.paymentId;
    const projectCode = session.metadata?.projectCode;
    const paymentType = session.metadata?.paymentType;
    const customerName = session.metadata?.customerName;
    const planName = session.metadata?.planName;
    const customerEmail =
      session.customer_email || session.metadata?.customerEmail;

    if (paymentType === "initial" && paymentId && customerEmail) {
      try {
        // ✅ Actualizar en BD
        await prisma.payment.update({
          where: { id: paymentId },
          data: {
            firstPaid: true,
            firstPaidAt: new Date(),
            projectStatus: "in_progress",
          },
        });
        console.log(`💾 Pago inicial actualizado en BD: ${paymentId}`);

        // ✅ Enviar correo
        const resend = new Resend(process.env.RESEND_API_KEY!);
        const emailResult = await resend.emails.send({
          from: "RC Web <no-reply@rcweb.dev>",
          to: customerEmail,
          subject: "✅ Payment Confirmed - Your Project Code",
          html: `
            <!DOCTYPE html>
            <html>
              <body style="font-family: Arial, sans-serif; background: #1a1a1a; color: #fff; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: #2a2a2a; border-radius: 10px; padding: 30px;">
                  <h1 style="color: #10b981;">Payment Confirmed! ✅</h1>
                  <p>Hi ${customerName},</p>
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
                    <li>We'll contact you within 24 hours to discuss project details</li>
                    <li>Project development will take ${
                      planName === "Starter"
                        ? "2-3 weeks"
                        : planName === "Growth"
                          ? "3-5 weeks"
                          : "6-8 weeks"
                    }</li>
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
                      • This email address: ${customerEmail}<br>
                      • Your project code: <strong>${projectCode}</strong>
                    </p>
                  </div>
                </div>
              </body>
            </html>
          `,
        });

        console.log("📨 Resultado Resend:", emailResult);
        console.log(`📧 Email enviado a ${customerEmail}`);
      } catch (err) {
        console.error("❌ Error enviando email inicial:", err);
      }
    } else {
      console.log("⚠️ No se cumplen condiciones para enviar correo inicial");
    }
  }

  return NextResponse.json({ received: true });
}
