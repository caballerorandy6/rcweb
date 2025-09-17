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

// Definir los productos/planes
const PRICING_PLANS = {
  starter: {
    priceId: "price_starter", // Crear en Stripe Dashboard
    mode: "payment" as const,
  },
  growth: {
    priceId: "price_growth",
    mode: "payment" as const,
  },
  premium: {
    priceId: "price_premium",
    mode: "payment" as const,
  },
};

export async function createCheckoutSession(
  planId: "starter" | "growth" | "premium",
  customerEmail?: string
): Promise<CheckoutSessionResponse> {
  try {
    const plan = PRICING_PLANS[planId];

    if (!plan) {
      return {
        success: false,
        error: "Invalid plan selected",
      };
    }

    // Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: plan.mode,
      customer_email: customerEmail,
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/#pricing`,
      metadata: {
        planId,
      },
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
