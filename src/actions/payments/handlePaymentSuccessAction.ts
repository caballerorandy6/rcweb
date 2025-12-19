"use server";

import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import {
  sendInitialPaymentConfirmation,
  sendAdminInitialPaymentFallback,
} from "@/lib/email/senders";

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

    // AUMENTAR el tiempo de espera para dar más tiempo al webhook
    let payment = null;
    let attempts = 0;
    const maxAttempts = 30; // 30 intentos × 1s = 30 segundos
    const delayMs = 1000;

        while (attempts < maxAttempts && !payment) {
      try {
        // Buscar por projectCode O por sessionId
        payment = await prisma.payment.findFirst({
          where: {
            OR: [
              { projectCode: finalProjectCode },
              { firstSessionId: session.id },
            ],
          },
        });

        if (payment) {
          console.log(
            `✅ Payment encontrado después de ${attempts + 1} segundos (webhook procesó)`
          );
          return { success: true, payment, fallbackUsed: false };
        }
      } catch {
              }

      attempts++;
      if (attempts < maxAttempts) {
        // Usar backoff exponencial para los últimos intentos
        const waitTime = attempts > 10 ? delayMs * 2 : delayMs;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    // FALLBACK: Solo si el webhook definitivamente no procesó después de 30 segundos
        // Última verificación antes de crear
    const existingPayment = await prisma.payment.findFirst({
      where: {
        OR: [{ projectCode: finalProjectCode }, { firstSessionId: session.id }],
      },
    });

    if (existingPayment) {
            return { success: true, payment: existingPayment, fallbackUsed: false };
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

    // Crear Payment con lock optimista para evitar duplicados
    try {
      payment = await prisma.$transaction(async (tx) => {
        // Verificar una vez más dentro de la transacción
        const checkAgain = await tx.payment.findFirst({
          where: {
            OR: [
              { projectCode: finalProjectCode },
              { firstSessionId: session.id },
            ],
          },
        });

        if (checkAgain) {
                    return checkAgain;
        }

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

            // ENVIAR EMAILS DESDE FALLBACK
      const resend = new Resend(process.env.RESEND_API_KEY!);

      try {
        // Email al cliente
        await sendInitialPaymentConfirmation(resend, {
          customerEmail,
          customerName,
          planName,
          projectCode: finalProjectCode,
          firstPaymentAmount,
          secondPaymentAmount,
          totalAmount,
        });

        // Email al admin con alerta de fallback
        await sendAdminInitialPaymentFallback(resend, {
          projectCode: finalProjectCode,
          customerName,
          customerEmail,
          planName,
          firstPaymentAmount,
          paymentId: payment.id,
        });
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
        // Unique constraint - el webhook procesó mientras estábamos en el fallback
        const existingPayment = await prisma.payment.findFirst({
          where: {
            OR: [
              { projectCode: finalProjectCode },
              { firstSessionId: session.id },
            ],
          },
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
