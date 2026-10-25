"use server";

import stripe from "@/lib/stripe";
import { checkoutPlans } from "@/lib/data";
import { CheckoutRequestSchema, type CheckoutRequest } from "@/lib/zod";
import { createInitialPaymentCheckout } from "@/lib/project/initialPaymentCheckout";
import { SITE_BASE_URL } from "@/lib/projectUrl";
import type { SubscriptionCheckoutMetadataInput } from "@/lib/checkoutMetadata";

// Stripe Price ID for Monthly Maintenance Subscription
// Set via environment variable for security and flexibility
const MAINTENANCE_PRICE_ID = process.env.STRIPE_MAINTENANCE_PRICE_ID!;

export interface StripeCheckoutResponse {
  success: boolean;
  sessionUrl?: string;
  projectCode?: string;
  error?: string;
}

export async function createStripeCheckoutAction(
  request: CheckoutRequest
): Promise<StripeCheckoutResponse> {
  const parsed = CheckoutRequestSchema.safeParse(request);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid checkout data",
    };
  }

  const { planId, customer } = parsed.data;

  // El precio nunca viene del navegador: se busca el plan en el servidor.
  // Solo los planes de alcance fijo se cobran aquí; el resto va por presupuesto.
  const checkoutPlan = checkoutPlans.find((p) => p.id === planId);
  if (!checkoutPlan) {
    return { success: false, error: "Selected plan is not available" };
  }

  try {
    if (checkoutPlan.mode === "subscription") {
      // Se registra en el servidor para que la fecha de aceptación sea confiable.
      const termsAcceptedAt = new Date().toISOString();

      const session = await stripe.checkout.sessions.create({
        allowed_payment_method_types: ["card"],
        mode: "subscription",
        customer_email: customer.email,
        billing_address_collection: "required",
        metadata: {
          paymentType: "subscription",
          planName: checkoutPlan.name,
          customerName: customer.name,
          customerEmail: customer.email,
          termsAcceptedAt,
        } satisfies SubscriptionCheckoutMetadataInput,
        line_items: [
          {
            price: MAINTENANCE_PRICE_ID,
            quantity: 1,
          },
        ],
        automatic_tax: { enabled: true },
        success_url: `${SITE_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&subscription=true`,
        cancel_url: `${SITE_BASE_URL}/#pricing`,
      });

      return {
        success: true,
        sessionUrl: session.url!,
      };
    }

    // ONE-TIME PAYMENT (50 % deposit): the webhook creates the Project from
    // the session metadata once Stripe confirms the payment.
    const { sessionUrl, projectCode } = await createInitialPaymentCheckout({
      planName: checkoutPlan.name,
      totalAmount: checkoutPlan.priceInCents,
      customerName: customer.name,
      customerEmail: customer.email,
      cancelUrl: `${SITE_BASE_URL}/#pricing`,
    });

    return { success: true, sessionUrl, projectCode };
  } catch (error) {
    console.error("❌ Error creating Stripe session:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create checkout session",
    };
  }
}
