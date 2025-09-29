// app/api/stripe/webhook/route.ts

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  // DEBUGGING: Log inicial para verificar que el webhook está siendo alcanzado
  console.log("🚀 Webhook endpoint alcanzado");
  console.log("🌐 URL completa:", req.url);
  console.log("🔍 Headers:", Object.fromEntries(req.headers.entries()));

  const body = await req.text();
  console.log("📦 Body length:", body.length);

  const signature = req.headers.get("stripe-signature") as string;
  console.log("🔑 Signature presente:", !!signature);
  console.log(
    "🔑 Signature value:",
    signature ? signature.substring(0, 20) + "..." : "null"
  );

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    console.log("✅ Evento verificado correctamente");
  } catch (err) {
    console.error("❌ Error verificando webhook signature:", err);
    return NextResponse.json(
      { error: `Webhook Error: ${err}` },
      { status: 400 }
    );
  }

  console.log("🔔 Webhook recibido:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};

    const paymentType = metadata.paymentType;
    const projectCode = metadata.projectCode;
    const customerName = metadata.customerName;
    const planName = metadata.planName;
    const customerEmail = session.customer_email || metadata.customerEmail;

    console.log("📋 Metadata recibido:", {
      paymentType,
      projectCode,
      customerEmail,
      planName,
      sessionId: session.id,
    });

    const resend = new Resend(process.env.RESEND_API_KEY!);

    // ============= PAGO INICIAL =============
    if (paymentType === "initial" && projectCode && customerEmail) {
      try {
        console.log("💰 Procesando PAGO INICIAL para:", projectCode);

        // VERIFICACIÓN 1: Por projectCode
        const existingByCode = await prisma.payment.findUnique({
          where: { projectCode },
        });

        if (existingByCode) {
          console.log("⚠️ Payment ya existe con projectCode:", projectCode);
          return NextResponse.json({ received: true, duplicate: "by_code" });
        }

        // VERIFICACIÓN 2: Por sessionId (evita duplicados si webhook se ejecuta 2 veces)
        const existingBySession = await prisma.payment.findFirst({
          where: { firstSessionId: session.id },
        });

        if (existingBySession) {
          console.log("⚠️ Payment ya existe con sessionId:", session.id);
          return NextResponse.json({ received: true, duplicate: "by_session" });
        }

        // Extraer montos de metadata
        const totalAmount = parseInt(metadata.totalAmount || "0");
        const firstPaymentAmount = parseInt(metadata.firstPaymentAmount || "0");
        const secondPaymentAmount = parseInt(
          metadata.secondPaymentAmount || "0"
        );

        console.log("💾 Creando nuevo Payment con projectCode:", projectCode);

        // CREAR Payment Y TermsAcceptance en transacción
        const payment = await prisma.$transaction(async (tx) => {
          const newPayment = await tx.payment.create({
            data: {
              projectCode,
              email: customerEmail,
              name: customerName || "Client",
              planName: planName || "Unknown Plan",
              totalAmount,
              firstPayment: firstPaymentAmount,
              secondPayment: secondPaymentAmount,
              firstPaid: true,
              firstPaidAt: new Date(),
              firstSessionId: session.id,
              projectStatus: "in_progress",
            },
          });

          if (metadata.termsAcceptedAt) {
            await tx.termsAcceptance.create({
              data: {
                paymentId: newPayment.id,
                acceptedAt: new Date(metadata.termsAcceptedAt),
                termsVersion: "2025-09-25",
                plan: planName,
                ipAddress: "stripe-checkout",
                userAgent: "stripe-checkout",
              },
            });
            console.log(
              "✅ TermsAcceptance creado para paymentId:",
              newPayment.id
            );
          }

          return newPayment;
        });

        console.log("✅ Payment creado exitosamente con ID:", payment.id);

        // ============= EMAIL AL CLIENTE =============
        try {
          await resend.emails.send({
            from: "RC Web <no-reply@rcweb.dev>",
            to: customerEmail,
            subject: `✅ Payment Confirmed - Your Project Code`,
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
                          <tr>
                            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 48px 32px; text-align: center;">
                              <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); border-radius: 50%; padding: 16px; margin-bottom: 16px;">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                              </div>
                              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">Payment Confirmed!</h1>
                              <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Your project has been initiated</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 40px 32px;">
                              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                                Hi <strong>${customerName || "Client"}</strong>,
                              </p>
                              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                                Thank you for your initial payment. We've started working on your <strong style="color: #7c3aed;">${planName}</strong> project!
                              </p>
                              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 32px 0;">
                                <p style="margin: 0 0 8px 0; color: #92400e; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                  Your Project Code
                                </p>
                                <p style="margin: 8px 0; font-family: 'Courier New', monospace; font-size: 36px; color: #d97706; font-weight: bold; letter-spacing: 4px;">
                                  ${projectCode}
                                </p>
                                <p style="margin: 8px 0 0 0; color: #92400e; font-size: 13px;">
                                  Save this code - Required for final payment
                                </p>
                              </div>
                              <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin: 0 0 32px 0;">
                                <h3 style="color: #111827; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">What Happens Next?</h3>
                                <ol style="color: #4b5563; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                                  <li style="margin-bottom: 8px;">We'll contact you within <strong>24 hours</strong> to discuss project details</li>
                                  <li style="margin-bottom: 8px;">Project development time based on your plan</li>
                                  <li style="margin-bottom: 8px;">We'll notify you when ready for final payment</li>
                                  <li>All deliverables provided after final payment</li>
                                </ol>
                              </div>
                              <div style="background-color: #f3f4f6; border-radius: 12px; padding: 20px; margin: 0 0 32px 0;">
                                <h3 style="color: #111827; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">Payment Summary</h3>
                                <table style="width: 100%; font-size: 14px;">
                                  <tr>
                                    <td style="padding: 4px 0; color: #6b7280;">Initial Payment (50%):</td>
                                    <td style="text-align: right; color: #059669; font-weight: 600;">$${(firstPaymentAmount / 100).toFixed(2)} ✓</td>
                                  </tr>
                                  <tr>
                                    <td style="padding: 4px 0; color: #6b7280;">Final Payment (50%):</td>
                                    <td style="text-align: right; color: #6b7280;">$${(secondPaymentAmount / 100).toFixed(2)}</td>
                                  </tr>
                                  <tr style="border-top: 1px solid #d1d5db;">
                                    <td style="padding: 8px 0 0 0; color: #374151; font-weight: 600;">Total Project Cost:</td>
                                    <td style="padding: 8px 0 0 0; text-align: right; color: #374151; font-weight: 600;">$${(totalAmount / 100).toFixed(2)}</td>
                                  </tr>
                                </table>
                              </div>
                              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
                              <p style="text-align: center; color: #6b7280; font-size: 14px; margin: 0;">
                                Questions? Contact us at <a href="mailto:contactus@rcweb.dev" style="color: #7c3aed; text-decoration: none;">contactus@rcweb.dev</a>
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
          console.log("✅ Email inicial enviado al cliente");
        } catch (emailError) {
          console.error("❌ Error enviando email al cliente:", emailError);
          // No fallar todo el proceso si el email falla
        }

        // ============= EMAIL AL ADMIN =============
        try {
          await resend.emails.send({
            from: "RC Web <no-reply@rcweb.dev>",
            to: "admin@rcweb.dev",
            subject: `💰 New advance payment received - Project ${projectCode}`,
            html: `
              <h2>New Initial Payment Received</h2>
              <p><strong>Project Code:</strong> ${projectCode}</p>
              <p><strong>Client:</strong> ${customerName || "Unknown"}</p>
              <p><strong>Email:</strong> ${customerEmail}</p>
              <p><strong>Plan:</strong> ${planName}</p>
              <p><strong>Initial Payment:</strong> $${(firstPaymentAmount / 100).toFixed(2)}</p>
              <p><strong>Pending Payment:</strong> $${(secondPaymentAmount / 100).toFixed(2)}</p>
              <p><strong>Payment ID:</strong> ${payment.id}</p>
              <hr>
              <p>Remember to contact the client within 24 hours to discuss project details.</p>
            `,
          });
          console.log("✅ Email enviado al admin");
        } catch (emailError) {
          console.error("❌ Error enviando email al admin:", emailError);
        }

        return NextResponse.json({ received: true, paymentId: payment.id });
      } catch (err: unknown) {
        // Si es error de unique constraint, significa que ya fue procesado
        if (
          typeof err === "object" &&
          err !== null &&
          "code" in err &&
          (err as { code?: string }).code === "P2002"
        ) {
          console.log("⚠️ Payment ya fue procesado (P2002)");
          return NextResponse.json({ received: true, duplicate: "constraint" });
        }

        console.error("❌ Error procesando pago inicial:", err);
        throw err; // Re-lanzar para que Stripe reintente
      }
    }

    // ============= PAGO FINAL =============
    else if (paymentType === "final" && metadata.paymentId && customerEmail) {
      console.log("💰 Procesando PAGO FINAL");

      const paymentId = metadata.paymentId;

      try {
        const payment = await prisma.payment.findUnique({
          where: { id: paymentId },
        });

        if (!payment) {
          console.error("❌ Payment no encontrado:", paymentId);
          return NextResponse.json({
            received: true,
            error: "Payment not found",
          });
        }

        // Verificar si ya fue procesado
        if (payment.secondPaid) {
          console.log("⚠️ Pago final ya fue procesado anteriormente");
          return NextResponse.json({
            received: true,
            duplicate: "already_paid",
          });
        }

        await prisma.payment.update({
          where: { id: paymentId },
          data: {
            secondPaid: true,
            secondPaidAt: new Date(),
            secondSessionId: session.id,
            projectStatus: "completed",
          },
        });

        console.log("✅ Payment actualizado - Proyecto completado");

        // ============= EMAIL DE PROYECTO COMPLETADO =============
        try {
          await resend.emails.send({
            from: "RC Web <no-reply@rcweb.dev>",
            to: customerEmail,
            subject: `🎉 Project Complete - ${payment.planName} Website Ready!`,
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
                          <tr>
                            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 48px 32px; text-align: center;">
                              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">Project Complete!</h1>
                              <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Your ${payment.planName} website is ready</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 40px 32px;">
                              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                                Hi <strong>${payment.name}</strong>,
                              </p>
                              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                                Congratulations! Your project has been successfully completed and your final payment of 
                                <strong style="color: #059669; font-size: 18px;">$${(payment.secondPayment / 100).toFixed(2)}</strong> has been received.
                              </p>
                              <div style="background-color: #f3f4f6; border-radius: 12px; padding: 20px; text-align: center;">
                                <p style="color: #4b5563; font-size: 14px; margin: 0 0 8px 0;">Need help? We're here for you!</p>
                                <a href="mailto:contactus@rcweb.dev" style="display: inline-block; background: #7c3aed; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Email Support</a>
                              </div>
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
          console.log("✅ Email de proyecto completado enviado");
        } catch (emailError) {
          console.error("❌ Error enviando email de completado:", emailError);
        }

        // ============= EMAIL AL ADMIN =============
        try {
          await resend.emails.send({
            from: "RC Web <no-reply@rcweb.dev>",
            to: "admin@rcweb.dev",
            subject: `💰 Final Payment Received - ${payment.planName} - ${payment.projectCode}`,
            html: `
              <h2>Final Payment Completed ✅</h2>
              <p><strong>Project Code:</strong> ${payment.projectCode}</p>
              <p><strong>Client:</strong> ${payment.name} (${customerEmail})</p>
              <p><strong>Plan:</strong> ${payment.planName}</p>
              <p><strong>Final Payment:</strong> $${(payment.secondPayment / 100).toFixed(2)}</p>
              <p><strong>Total Project Value:</strong> $${(payment.totalAmount / 100).toFixed(2)}</p>
              <p><strong>Project Status:</strong> COMPLETED</p>
            `,
          });
          console.log("✅ Email enviado al admin sobre pago final");
        } catch (emailError) {
          console.error("❌ Error enviando email al admin:", emailError);
        }

        return NextResponse.json({ received: true, completed: true });
      } catch (err) {
        console.error("❌ Error procesando pago final:", err);
        throw err;
      }
    } else {
      console.log("⚠️ Condiciones no cumplidas para procesar el pago");
      return NextResponse.json({
        received: true,
        warning: "Conditions not met",
      });
    }
  }

  return NextResponse.json({ received: true });
}
