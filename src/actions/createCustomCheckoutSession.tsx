"use server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export interface CheckoutSessionResponse {
  success: boolean;
  sessionUrl?: string;
  error?: string;
}

// Alternativa: Crear productos dinámicamente sin Price IDs predefinidos
export async function createCustomCheckoutSession(
  plan: {
    name: string;
    price: number; // en centavos
    description: string;
  },
  customerInfo?: {
    email?: string;
    name?: string;
  }
): Promise<CheckoutSessionResponse> {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerInfo?.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: plan.price,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          planName: plan.name,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/#pricing`,
    });

    return {
      success: true,
      sessionUrl: session.url!,
    };
  } catch (error) {
    console.error("Stripe error:", error);
    return {
      success: false,
      error: "Failed to create checkout session",
    };
  }
}
