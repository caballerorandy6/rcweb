"use server";

import { verifyProjectAccessAction } from "@/actions/projects/verifyProjectAccessAction";
import stripe from "@/lib/stripe";

interface SplitPaymentResponse {
  success: boolean;
  sessionUrl?: string;
  error?: string;
}

export async function createFinalPaymentSessionAction(
  email: string,
  projectCode: string
): Promise<SplitPaymentResponse> {
  try {
    // Verificar acceso
    const verification = await verifyProjectAccessAction(email, projectCode);

    if (!verification.success || !verification.data) {
      const errorMessage = !verification.success
        ? verification.error
        : "Access denied";
      console.error("❌ Verificación fallida:", errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }

    const project = verification.data.project;

    // IMPORTANTE: Incluir TODOS los campos necesarios en metadata
    const metadata = {
      projectId: project.id,
      projectCode: project.projectCode,
      paymentType: "final", // ← CRÍTICO: Este campo debe ser EXACTAMENTE "final"
      planName: project.planName || "Plan",
      customerEmail: email, // Incluir el email también
    };

    // Crear sesión de Stripe para pago final
    const session = await stripe.checkout.sessions.create({
      allowed_payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      metadata: metadata, // ← AQUÍ SE ENVÍA EL METADATA
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${project.planName} - Final Payment (50%)`,
              description: `Final payment upon project completion`,
            },
            unit_amount: project.finalAmount,
          },
          quantity: 1,
        },
      ],
      automatic_tax: { enabled: true },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-complete?code=${projectCode}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/final-payment`,
    });

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
