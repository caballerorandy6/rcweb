// actions/createFinalPaymentSessionAction.ts
"use server";

import { verifyProjectAccessAction } from "@/actions/verifyProjectAccessAction";
import { Stripe } from "stripe";
import { SplitPaymentResponse } from "@/actions/createInitialPaymentSessionAction";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function createFinalPaymentSessionAction(
  email: string,
  projectCode: string
): Promise<SplitPaymentResponse> {
  try {
    console.log("🔵 Iniciando createFinalPaymentSessionAction");
    console.log("📧 Email:", email);
    console.log("📝 Project Code:", projectCode);

    // Verificar acceso
    const verification = await verifyProjectAccessAction(email, projectCode);

    if (!verification.success || !verification.payment) {
      console.error("❌ Verificación fallida:", verification.error);
      return {
        success: false,
        error: verification.error || "Access denied",
      };
    }

    const payment = verification.payment;

    console.log("✅ Payment verificado:", {
      id: payment.id,
      planName: payment.planName,
      secondPayment: payment.secondPayment,
      name: payment.planName,
    });

    // IMPORTANTE: Incluir TODOS los campos necesarios en metadata
    const metadata = {
      paymentId: payment.id,
      projectCode: payment.projectCode,
      paymentType: "final", // ← CRÍTICO: Este campo debe ser EXACTAMENTE "final"
      planName: payment.planName || "Plan",
      customerEmail: email, // Incluir el email también
    };

    console.log("📦 Metadata a enviar:", metadata);

    // Crear sesión de Stripe para pago final
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      metadata: metadata, // ← AQUÍ SE ENVÍA EL METADATA
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${payment.planName} - Final Payment (50%)`,
              description: `Final payment upon project completion`,
            },
            unit_amount: payment.secondPayment,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-complete?code=${projectCode}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/final-payment`,
    });

    console.log("✅ Sesión de Stripe creada:", session.id);
    console.log("🔗 URL de checkout:", session.url);

    return {
      success: true,
      sessionUrl: session.url!,
    };
  } catch (error) {
    console.error("❌ Error creating final payment:", error);
    return {
      success: false,
      error: "Failed to create payment session",
    };
  }
}
