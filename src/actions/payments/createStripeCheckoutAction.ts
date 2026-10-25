"use server";

import stripe from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { generateProjectCode } from "@/lib/utils";
import { checkoutPlans } from "@/lib/data";
import { CheckoutRequestSchema, type CheckoutRequest } from "@/lib/zod";
import type {
  InitialCheckoutMetadataInput,
  SubscriptionCheckoutMetadataInput,
} from "@/lib/checkoutMetadata";

// Stripe Price ID for Monthly Maintenance Subscription
// Set via environment variable for security and flexibility
const MAINTENANCE_PRICE_ID = process.env.STRIPE_MAINTENANCE_PRICE_ID!;

export interface StripeCheckoutResponse {
  success: boolean;
  sessionUrl?: string;
  projectCode?: string;
  error?: string;
}

// Random 6-char code; the webhook uses it as the idempotency key, so make
// sure it is not already taken before putting it in the session
async function uniqueProjectCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateProjectCode();
    const taken = await prisma.project.findUnique({
      where: { projectCode: code },
      select: { id: true },
    });
    if (!taken) return code;
  }
  throw new Error("Could not generate a unique project code");
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

  const plan = {
    name: checkoutPlan.name,
    price: checkoutPlan.priceInCents,
  };

  // Se registra en el servidor para que la fecha de aceptación sea confiable.
  const termsAcceptedAt = new Date().toISOString();

  try {
    const isSubscription = checkoutPlan.mode === "subscription";

    if (isSubscription) {
      // Create SUBSCRIPTION session for maintenance plan
      const session = await stripe.checkout.sessions.create({
        allowed_payment_method_types: ["card"],
        mode: "subscription",
        customer_email: customer.email,
        billing_address_collection: "required",
        metadata: {
          paymentType: "subscription",
          planName: plan.name,
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
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&subscription=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/#pricing`,
      });

      return {
        success: true,
        sessionUrl: session.url!,
      };
    }

    // ONE-TIME PAYMENT for all other plans
    const projectCode = await uniqueProjectCode();

    // Calcular montos
    const firstPaymentAmount = Math.round(plan.price * 0.5);
    const secondPaymentAmount = plan.price - firstPaymentAmount;

    // The webhook creates the Project from this metadata once Stripe confirms
    // the payment; nothing is written to the database before that.
    const session = await stripe.checkout.sessions.create({
      allowed_payment_method_types: ["card"],
      mode: "payment",
      customer_email: customer.email,
      billing_address_collection: "required",
      metadata: {
        paymentType: "initial",
        projectCode,
        planName: plan.name,
        customerName: customer.name,
        customerEmail: customer.email,
        firstPaymentAmount: firstPaymentAmount.toString(),
        secondPaymentAmount: secondPaymentAmount.toString(),
        totalAmount: plan.price.toString(),
        termsAcceptedAt,
      } satisfies InitialCheckoutMetadataInput,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${plan.name} - Initial Payment (50%)`,
              description: `50% deposit for ${plan.name}; the balance is due on delivery`,
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