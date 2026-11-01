"use server";

import { getLocale, getTranslations } from "next-intl/server";
import { localizePathname } from "@/i18n/paths";
import type { Locale } from "@/i18n/routing";
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
  const [t, rawLocale] = await Promise.all([getTranslations("Actions"), getLocale()]);
  const locale = rawLocale as Locale;
  const parsed = CheckoutRequestSchema.safeParse(request);
  if (!parsed.success) {
    return { success: false, error: t("checkout.invalid") };
  }

  const { planId, customer } = parsed.data;

  // El precio nunca viene del navegador: se busca el plan en el servidor.
  // Solo los planes de alcance fijo se cobran aquí; el resto va por presupuesto.
  const checkoutPlan = checkoutPlans.find((p) => p.id === planId);
  if (!checkoutPlan) {
    return { success: false, error: t("checkout.planUnavailable") };
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
        success_url: `${SITE_BASE_URL}${localizePathname("/payment-success", locale)}?session_id={CHECKOUT_SESSION_ID}&subscription=true`,
        cancel_url: `${SITE_BASE_URL}${localizePathname("/", locale)}#pricing`,
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
      cancelUrl: `${SITE_BASE_URL}${localizePathname("/", locale)}#pricing`,
      locale,
    });

    return { success: true, sessionUrl, projectCode };
  } catch (error) {
    console.error("❌ Error creating Stripe session:", error);
    return {
      success: false,
      error: t("checkout.failed"),
    };
  }
}
