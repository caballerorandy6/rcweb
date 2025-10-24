"use server";

import Stripe from "stripe";
import { generateProjectCode } from "@/lib/utils";

export interface StripeCheckoutResponse {
  success: boolean;
  sessionUrl?: string;
  projectCode?: string;
  error?: string;
}

export async function createStripeCheckoutAction({
  plan,
  customer,
  termsAcceptedAt,
}: {
  plan: {
    name: string;
    price: number;
    description: string;
  };
  customer: {
    email: string;
    name: string;
  };
  termsAcceptedAt: string;
}): Promise<StripeCheckoutResponse> {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-08-27.basil",
    });

    // Generar projectCode único
    const projectCode = generateProjectCode();
    
    // Calcular montos
    const firstPaymentAmount = Math.round(plan.price * 0.5);
    const secondPaymentAmount = plan.price - firstPaymentAmount;

    // Crear sesión de Stripe CON TODA LA METADATA
    // El Payment se creará en el webhook DESPUÉS del pago exitoso
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customer.email,
      billing_address_collection: "required",
      metadata: {
        // Toda la info necesaria para crear Payment después
        projectCode,
        paymentType: "initial",
        planName: plan.name,
        planPrice: plan.price.toString(),
        customerName: customer.name,
        customerEmail: customer.email,
        firstPaymentAmount: firstPaymentAmount.toString(),
        secondPaymentAmount: secondPaymentAmount.toString(),
        totalAmount: plan.price.toString(),
        termsAcceptedAt,
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${plan.name} - Initial Payment (50%)`,
              description: `Initial payment for ${plan.description}`,
            },
            unit_amount: firstPaymentAmount,
          },
          quantity: 1,
        },
      ],
      automatic_tax: { enabled: true },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&code=${projectCode}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/#pricing`,
    });

    return {
      success: true,
      sessionUrl: session.url!,
      projectCode,
    };
  } catch (error) {
    console.error("❌ Error creating Stripe session:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create checkout session",
    };
  }
}