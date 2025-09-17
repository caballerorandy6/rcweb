import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Manejar diferentes tipos de eventos
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Guardar información del pago
      console.log("Payment successful for session:", session.id);

      // Aquí puedes:
      // 1. Crear un registro del proyecto

      // 2. Enviar email de confirmación
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "no-reply@rcweb.dev",
        to: session.customer_email!,
        subject: "Payment Confirmation - RC Web",
        html: `
        <div style="font-family: Arial, sans-serif; line-height:1.5; color:#333;">
          <h2 style="color:#0f172a;">Thank you for your payment!</h2>
          <p>Your checkout has been completed successfully.</p>
          <p>We are excited to start working on your project 🚀</p>
          <p>You will receive the next steps shortly from our team.</p>
          <br/>
          <p style="font-size:14px; color:#64748b;">Best regards,<br/>RC Web Team</p>
        </div>
      `,
      });

      // 3. Actualizar el estado del contacto a "customer"

      if (session.customer_email) {
        // Buscar o crear contacto
        const existingContact = await prisma.contact.findFirst({
          where: {
            emails: {
              some: { email: session.customer_email },
            },
          },
        });

        if (existingContact) {
          // Actualizar estado o agregar nota
          console.log("Customer found:", existingContact.id);
        } else {
          // Crear nuevo contacto como cliente
          await prisma.contact.create({
            data: {
              name: session.customer_details?.name || "Customer",
              marketingConsent: false, // Por defecto no tiene consentimiento
              emails: {
                create: {
                  email: session.customer_email,
                },
              },
            },
          });
        }

        // Enviar email de confirmación (opcional)
        // await sendConfirmationEmail(session.customer_email);
      }

      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("Payment intent succeeded:", paymentIntent.id);
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("Payment failed:", paymentIntent.id);
      // Manejar pago fallido
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
