// app/api/stripe/webhook/route.ts

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
    });

    const resend = new Resend(process.env.RESEND_API_KEY!);

    // ============= PAGO INICIAL - CREAR PAYMENT Y TERMSACCEPTANCE =============
    if (paymentType === "initial" && projectCode && customerEmail) {
      try {
        // Verificar si ya existe para evitar duplicados (idempotencia)
        const existingPayment = await prisma.payment.findUnique({
          where: { projectCode },
        });

        if (existingPayment) {
          console.log("⚠️ Payment ya existe para projectCode:", projectCode);
          return NextResponse.json({ received: true });
        }

        // Extraer todos los montos de metadata
        const totalAmount = parseInt(metadata.totalAmount || "0");
        const firstPaymentAmount = parseInt(metadata.firstPaymentAmount || "0");
        const secondPaymentAmount = parseInt(
          metadata.secondPaymentAmount || "0"
        );

        console.log("💾 Creando nuevo Payment con projectCode:", projectCode);

        // CREAR Payment Y TermsAcceptance en una transacción atómica
        const payment = await prisma.$transaction(async (tx) => {
          // 1. Crear el registro de Payment
          const newPayment = await tx.payment.create({
            data: {
              projectCode, // Generado con tu función generateProjectCode()
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

          // 2. Crear TermsAcceptance ligado al Payment recién creado
          if (metadata.termsAcceptedAt) {
            await tx.termsAcceptance.create({
              data: {
                paymentId: newPayment.id, // ID del Payment recién creado
                acceptedAt: new Date(metadata.termsAcceptedAt),
                termsVersion: "2025-09-25",
                plan: planName,
                ipAddress: "stripe-checkout",
                userAgent: "stripe-checkout",
                // NO incluir userId ya que no es necesario
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

        // ============= ENVIAR EMAIL AL CLIENTE =============
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
                        <!-- Header -->
                        <tr>
                          <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 48px 32px; text-align: center;">
                            <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); border-radius: 50%; padding: 16px; margin-bottom: 16px;">
                              <!-- Check Circle Icon -->
                              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                              </svg>
                            </div>
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">Payment Confirmed!</h1>
                            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Your project has been initiated</p>
                          </td>
                        </tr>
                        
                        <!-- Body -->
                        <tr>
                          <td style="padding: 40px 32px;">
                            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                              Hi <strong>${customerName || "Client"}</strong>,
                            </p>
                            
                            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                              Thank you for your initial payment. We've started working on your <strong style="color: #7c3aed;">${planName}</strong> project!
                            </p>
                            
                            <!-- Project Code Box -->
                            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 32px 0;">
                              <p style="margin: 0 0 8px 0; color: #92400e; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                Your Project Code
                              </p>
                              <p style="margin: 8px 0; font-family: 'Courier New', monospace; font-size: 36px; color: #d97706; font-weight: bold; letter-spacing: 4px;">
                                ${projectCode}
                              </p>
                              <p style="margin: 8px 0 0 0; color: #92400e; font-size: 13px;">
                                <svg style="display: inline-block; vertical-align: middle; margin-right: 4px;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2">
                                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                  <line x1="12" y1="9" x2="12" y2="13"></line>
                                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                                Save this code - Required for final payment
                              </p>
                            </div>
                            
                            <!-- Timeline Section -->
                            <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin: 0 0 32px 0;">
                              <h3 style="color: #111827; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                                <svg style="display: inline-block; vertical-align: middle; margin-right: 8px;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                                What Happens Next?
                              </h3>
                              <ol style="color: #4b5563; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                                <li style="margin-bottom: 8px;">We'll contact you within <strong>24 hours</strong> to discuss project details</li>
                                <li style="margin-bottom: 8px;">Project development time based on your plan</li>
                                <li style="margin-bottom: 8px;">We'll notify you when ready for final payment</li>
                                <li>All deliverables provided after final payment</li>
                              </ol>
                            </div>
                            
                            <!-- Payment Summary -->
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
                            
                            <!-- Final Payment Info -->
                            <div style="background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); border-left: 4px solid #7c3aed; border-radius: 8px; padding: 20px; margin: 0 0 32px 0;">
                              <p style="margin: 0 0 12px 0; color: #5b21b6; font-weight: 600; font-size: 16px;">
                                <svg style="display: inline-block; vertical-align: middle; margin-right: 6px;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2">
                                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                  <path d="M2 17l10 5 10-5"></path>
                                  <path d="M2 12l10 5 10-5"></path>
                                </svg>
                                Final Payment Instructions
                              </p>
                              <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px;">
                                When your project is ready, visit:
                              </p>
                              <p style="margin: 0 0 8px 0;">
                                <a href="https://rcweb.dev/final-payment" style="color: #7c3aed; font-weight: 600; text-decoration: none;">https://rcweb.dev/final-payment</a>
                              </p>
                              <p style="margin: 0; color: #4b5563; font-size: 14px;">
                                You'll need this email address and your project code: <strong>${projectCode}</strong>
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
                              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${encodeURIComponent(customerEmail)}" style="color: #7c3aed; text-decoration: none;">here</a>.
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

        // ============= NOTIFICAR AL ADMIN =============
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
      } catch (err) {
        // Si es un error de constraint único (P2002), significa que ya fue procesado
        interface PrismaError extends Error {
          code?: string;
        }
        const prismaErr = err as PrismaError;
        if (prismaErr.code === "P2002") {
          console.log("⚠️ Payment ya fue procesado anteriormente");
          return NextResponse.json({ received: true });
        }

        console.error("❌ Error procesando pago inicial:", err);
        // Re-lanzar el error para que Stripe reintente si es necesario
        throw err;
      }
    }

    // ============= PAGO FINAL =============
    else if (paymentType === "final" && metadata.paymentId && customerEmail) {
      console.log("💰 Procesando PAGO FINAL");

      const paymentId = metadata.paymentId;

      try {
        // Buscar el payment existente
        const payment = await prisma.payment.findUnique({
          where: { id: paymentId },
        });

        if (!payment) {
          console.error("Payment no encontrado:", paymentId);
          return NextResponse.json({ received: true });
        }

        // Actualizar el Payment como completamente pagado
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
                        <!-- Header -->
                        <tr>
                          <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 48px 32px; text-align: center;">
                            <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); border-radius: 50%; padding: 16px; margin-bottom: 16px;">
                              <!-- Trophy Icon -->
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
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">Project Complete!</h1>
                            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Your ${payment.planName} website is ready</p>
                          </td>
                        </tr>
                        
                        <!-- Body -->
                        <tr>
                          <td style="padding: 40px 32px;">
                            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                              Hi <strong>${payment.name}</strong>,
                            </p>
                            
                            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                              Congratulations! Your project has been successfully completed and your final payment of 
                              <strong style="color: #059669; font-size: 18px;">$${(payment.secondPayment / 100).toFixed(2)}</strong> has been received.
                            </p>
                            
                            <!-- Project Summary -->
                            <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin: 0 0 32px 0;">
                              <h3 style="color: #111827; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                                <svg style="display: inline-block; vertical-align: middle; margin-right: 8px;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
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
                                  <td style="padding: 6px 0; color: #6b7280;">Total Investment:</td>
                                  <td style="text-align: right; font-weight: 600; color: #059669; font-size: 16px;">$${(payment.totalAmount / 100).toFixed(2)}</td>
                                </tr>
                                <tr>
                                  <td style="padding: 6px 0; color: #6b7280;">Status:</td>
                                  <td style="text-align: right;">
                                    <span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                                      ✓ DELIVERED
                                    </span>
                                  </td>
                                </tr>
                              </table>
                            </div>
                            
                            <!-- Next Steps -->
                            <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-left: 4px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 0 0 32px 0;">
                              <h3 style="color: #1e40af; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">
                                <svg style="display: inline-block; vertical-align: middle; margin-right: 6px;" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
                                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                </svg>
                                What's Next?
                              </h3>
                              <ol style="color: #374151; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                                <li style="margin-bottom: 6px;">Check your email for repository access and credentials</li>
                                <li style="margin-bottom: 6px;">Review the provided documentation</li>
                                <li style="margin-bottom: 6px;">Schedule your training session at your convenience</li>
                                <li>Contact our support team for any questions</li>
                              </ol>
                            </div>
                            
                            <!-- Thank You Box -->
                            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 32px 0;">
                              <svg style="display: inline-block; margin-bottom: 8px;" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                              </svg>
                              <p style="color: #92400e; font-size: 18px; font-weight: 600; margin: 0;">
                                Thank you for choosing RC Web!
                              </p>
                              <p style="color: #b45309; font-size: 14px; margin: 8px 0 0 0;">
                                We're excited to see your business grow with your new website
                              </p>
                            </div>
                            
                            <!-- Support Section -->
                            <div style="background-color: #f3f4f6; border-radius: 12px; padding: 20px; text-align: center;">
                              <p style="color: #4b5563; font-size: 14px; margin: 0 0 8px 0;">
                                Need help? We're here for you!
                              </p>
                              <div>
                                <a href="mailto:contactus@rcweb.dev" style="display: inline-block; background: #7c3aed; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 4px;">
                                  Email Support
                                </a>
                                <a href="https://rcweb.dev" style="display: inline-block; background: #10b981; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 4px;">
                                  Visit Website
                                </a>
                              </div>
                            </div>
                           
                            <!-- Footer -->
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
                            <p style="text-align: center; color: #6b7280; font-size: 14px; margin: 0;">
                              Questions? Contact us at <a href="mailto:contactus@rcweb.dev" style="color: #7c3aed; text-decoration: none;">contactus@rcweb.dev</a>
                            </p>
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
                            <p style="text-align: center; color: #6b7280; font-size: 12px;">
                              You can unsubscribe from marketing emails at any time by clicking 
                              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${encodeURIComponent(customerEmail)}" style="color: #7c3aed; text-decoration: none;">here</a>.
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

        console.log("✅ Email de proyecto completado enviado al cliente");

        // ============= NOTIFICAR AL ADMIN DEL PAGO FINAL =============
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
            <hr>
            <p style="background: #fef3c7; padding: 12px; border-radius: 8px;">
              <strong>⚠️ ACTION REQUIRED:</strong><br>
              Remember to send repository access and schedule training session!
            </p>
          `,
        });

        console.log("✅ Email enviado al admin sobre pago final");
      } catch (err) {
        console.error("❌ Error procesando pago final:", err);
        // Re-lanzar para reintentos
        throw err;
      }
    }

    // ============= SI NO CUMPLE CONDICIONES =============
    else {
      console.log("⚠️ Condiciones no cumplidas para procesar el pago:");
      console.log("- paymentType:", paymentType);
      console.log("- projectCode:", projectCode);
      console.log("- paymentId:", metadata.paymentId);
      console.log("- customerEmail:", customerEmail);

      // Registrar pero no fallar
      return NextResponse.json({
        received: true,
        warning: "Payment received but conditions not met for processing",
      });
    }
  }

  // Retornar éxito para otros tipos de eventos
  return NextResponse.json({ received: true });
}
