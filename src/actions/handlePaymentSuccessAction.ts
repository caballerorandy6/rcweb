"use server";

import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function handlePaymentSuccessAction(
  sessionId: string,
  projectCode?: string
) {
  if (!sessionId) {
    return { success: false, error: "No session ID provided" };
  }

  try {
    // 1. Obtener la sesión de Stripe
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

    // 2. Intentar obtener el Payment con reintentos
    let payment = null;
    let attempts = 0;
    const maxAttempts = 10;
    const delayMs = 1000;

    while (attempts < maxAttempts && !payment) {
      try {
        payment = await prisma.payment.findUnique({
          where: { projectCode: finalProjectCode },
        });

        if (payment) {
          console.log(
            `✅ Payment encontrado después de ${attempts + 1} intentos`
          );
          break;
        }
      } catch (error) {
        console.log(`Intento ${attempts + 1}: Payment aún no existe, ${error}`);
      }

      attempts++;

      if (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    // 3. Si después de reintentos no existe, lo creamos nosotros
    if (!payment) {
      console.log(
        "⚠️ Webhook no procesó a tiempo, creando Payment desde success page..."
      );

      const customerEmail = session.customer_email || metadata.customerEmail;
      const customerName = metadata.customerName || "Client";
      const planName = metadata.planName || "Unknown Plan";
      const totalAmount = parseInt(metadata.totalAmount || "0");
      const firstPaymentAmount = parseInt(metadata.firstPaymentAmount || "0");
      const secondPaymentAmount = parseInt(metadata.secondPaymentAmount || "0");

      if (!customerEmail) {
        return { success: false, error: "Customer email not found" };
      }

      // Crear Payment con transacción
      payment = await prisma.$transaction(async (tx) => {
        // Crear Payment
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

        // Crear TermsAcceptance si hay metadata
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

      console.log("✅ Payment creado desde payment-success:", payment.id);

      // Enviar notificación de que se usó el fallback
      console.warn(
        "⚠️ ALERTA: Payment creado desde fallback, verificar webhook"
      );
    }

    return {
      success: true,
      payment,
      fallbackUsed: attempts >= maxAttempts,
    };
  } catch (error) {
    console.error("Error in handlePaymentSuccess:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to process payment",
    };
  }
}
