"use server";

import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function handlePaymentSuccessAction(
  sessionId: string,
  projectCode?: string
) {
  if (!sessionId) {
    return { success: false, error: "No session ID provided" };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session || session.payment_status !== "paid") {
      return { success: false, error: "Payment not completed" };
    }

    const metadata = session.metadata || {};
    const finalProjectCode = projectCode || metadata.projectCode;

    if (!finalProjectCode) {
      console.error("No project code found in session or params");
      return { success: false, error: "No project code found" };
    }

    // Esperar a que el webhook procese (5 segundos solamente)
    let payment = null;
    let attempts = 0;
    const maxAttempts = 5; // Solo 5 intentos × 1s = 5 segundos
    const delayMs = 1000;

    console.log(`🔄 Esperando a que webhook procese: ${finalProjectCode}`);

    while (attempts < maxAttempts && !payment) {
      try {
        payment = await prisma.payment.findUnique({
          where: { projectCode: finalProjectCode },
        });

        if (payment) {
          console.log(
            `✅ Payment encontrado después de ${attempts + 1} segundos`
          );
          return { success: true, payment, fallbackUsed: false };
        }
      } catch (error) {
        console.log(`Intento ${attempts + 1}/${maxAttempts}`, error);
      }

      attempts++;
      if (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    // FALLBACK: Crear Payment Y enviar emails
    console.log("⚠️ Webhook no procesó, usando fallback...");

    // Última verificación
    const existingPayment = await prisma.payment.findUnique({
      where: { projectCode: finalProjectCode },
    });

    if (existingPayment) {
      return { success: true, payment: existingPayment, fallbackUsed: false };
    }

    const paymentBySession = await prisma.payment.findFirst({
      where: { firstSessionId: session.id },
    });

    if (paymentBySession) {
      return { success: true, payment: paymentBySession, fallbackUsed: false };
    }

    // Preparar datos
    const customerEmail = session.customer_email || metadata.customerEmail;
    const customerName = metadata.customerName || "Client";
    const planName = metadata.planName || "Unknown Plan";
    const totalAmount = parseInt(metadata.totalAmount || "0");
    const firstPaymentAmount = parseInt(metadata.firstPaymentAmount || "0");
    const secondPaymentAmount = parseInt(metadata.secondPaymentAmount || "0");

    if (!customerEmail) {
      return { success: false, error: "Customer email not found" };
    }

    // Crear Payment
    try {
      payment = await prisma.$transaction(async (tx) => {
        const newPayment = await tx.payment.create({
          data: {
            projectCode: finalProjectCode,
            email: customerEmail,
            name: customerName,
            planName: planName,
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
              ipAddress: "payment-success-fallback",
              userAgent: "payment-success-fallback",
            },
          });
        }

        return newPayment;
      });

      console.log("✅ Payment creado desde fallback:", payment.id);

      // ENVIAR EMAILS DESDE FALLBACK
      const resend = new Resend(process.env.RESEND_API_KEY!);

      try {
        await resend.emails.send({
          from: "RC Web <no-reply@rcweb.dev>",
          to: customerEmail,
          subject: `✅ Payment Confirmed - Your Project Code`,
          html: `
            <!DOCTYPE html>
            <html>
              <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f3f4f6; padding: 40px 20px;">
                  <tr>
                    <td align="center">
                      <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <tr>
                          <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 48px 32px; text-align: center; border-radius: 16px 16px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">Payment Confirmed!</h1>
                            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Your project has been initiated</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 40px 32px;">
                            <p style="color: #374151; font-size: 16px; margin: 0 0 24px 0;">
                              Hi <strong>${customerName}</strong>,
                            </p>
                            <p style="color: #374151; font-size: 16px; margin: 0 0 32px 0;">
                              Thank you for your initial payment. We've started working on your <strong style="color: #7c3aed;">${planName}</strong> project!
                            </p>
                            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 32px 0;">
                              <p style="margin: 0 0 8px 0; color: #92400e; font-size: 12px; font-weight: 600; text-transform: uppercase;">Your Project Code</p>
                              <p style="margin: 8px 0; font-family: 'Courier New', monospace; font-size: 36px; color: #d97706; font-weight: bold; letter-spacing: 4px;">${finalProjectCode}</p>
                              <p style="margin: 8px 0 0 0; color: #92400e; font-size: 13px;">Save this code - Required for final payment</p>
                            </div>
                            <div style="background-color: #f3f4f6; border-radius: 12px; padding: 20px; margin: 0 0 32px 0;">
                              <h3 style="color: #111827; font-size: 16px; margin: 0 0 12px 0;">Payment Summary</h3>
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
                                  <td style="padding: 8px 0 0 0; color: #374151; font-weight: 600;">Total:</td>
                                  <td style="padding: 8px 0 0 0; text-align: right; color: #374151; font-weight: 600;">$${(totalAmount / 100).toFixed(2)}</td>
                                </tr>
                              </table>
                            </div>
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
                            <p style="text-align: center; color: #6b7280; font-size: 14px; margin: 0;">
                              Questions? <a href="mailto:contactus@rcweb.dev" style="color: #7c3aed; text-decoration: none;">contactus@rcweb.dev</a>
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
        console.log("✅ Email enviado al cliente desde fallback");

        await resend.emails.send({
          from: "RC Web <no-reply@rcweb.dev>",
          to: "admin@rcweb.dev",
          subject: `💰 New payment (FALLBACK) - ${finalProjectCode}`,
          html: `
            <h2>New Initial Payment (Created via Fallback)</h2>
            <p><strong>⚠️ WEBHOOK NO PROCESÓ - Payment creado desde fallback</strong></p>
            <p><strong>Project Code:</strong> ${finalProjectCode}</p>
            <p><strong>Client:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Plan:</strong> ${planName}</p>
            <p><strong>Initial Payment:</strong> $${(firstPaymentAmount / 100).toFixed(2)}</p>
            <p><strong>Payment ID:</strong> ${payment.id}</p>
            <hr>
            <p style="color: red;">⚠️ IMPORTANTE: Revisar configuración del webhook en Stripe Dashboard</p>
          `,
        });
        console.log("✅ Email enviado al admin desde fallback");
      } catch (emailError) {
        console.error("❌ Error enviando emails desde fallback:", emailError);
      }

      return { success: true, payment, fallbackUsed: true };
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "P2002"
      ) {
        const existingPayment = await prisma.payment.findUnique({
          where: { projectCode: finalProjectCode },
        });
        if (existingPayment) {
          return {
            success: true,
            payment: existingPayment,
            fallbackUsed: false,
          };
        }
      }
      throw error;
    }
  } catch (error) {
    console.error("❌ Error in handlePaymentSuccess:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to process payment",
    };
  }
}
