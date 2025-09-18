import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  // 👇 Importante: obtener el raw body
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    // Verificar la firma del webhook
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.error("Error verificando webhook:", err);
    return NextResponse.json(
      { error: `Webhook Error: ${err}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Debugging
    console.log("Evento recibido:", event.type);
    console.log("Metadata:", session.metadata);
    console.log("Customer email:", session.customer_email);
    console.log("API KEY RESEND existe?", !!process.env.RESEND_API_KEY);

    const paymentId = session.metadata?.paymentId;
    const projectCode = session.metadata?.projectCode;
    const paymentType = session.metadata?.paymentType;
    const customerName = session.metadata?.customerName;

    if (paymentType === "initial" && paymentId) {
      // ✅ Actualizar el pago en BD
      const payment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          firstPaid: true,
          firstPaidAt: new Date(),
          projectStatus: "in_progress",
        },
      });

      // ✅ Crear instancia de Resend aquí (no arriba)
      const resend = new Resend(process.env.RESEND_API_KEY!);

      // ✅ Enviar email
      try {
        const emailResult = await resend.emails.send({
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
                </div>
              </body>
            </html>
          `,
        });

        console.log("Email enviado:", emailResult);
      } catch (err) {
        console.error("Error enviando email:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
