import stripe from "@/lib/stripe";
import type { FinalCheckoutMetadataInput } from "@/lib/checkoutMetadata";
import { getProjectUrl, SITE_BASE_URL } from "@/lib/projectUrl";
import { localizePathname } from "@/i18n/paths";
import { routing, type Locale } from "@/i18n/routing";

export interface FinalPaymentProject {
  id: string;
  projectCode: string;
  planName: string;
  email: string;
  accessToken: string;
  /** Amount of the final charge, in cents */
  finalAmount: number;
}

/** Where the customer came from; cancelling sends them back there. */
export type FinalPaymentOrigin = "form" | "magic-link";

/**
 * Creates the Stripe Checkout Session for the final 50 %. Callers verify
 * access first (email + project code behind a rate limit, or the access
 * token) and check that the project is ready for payment.
 */
export async function createFinalPaymentCheckout(
  project: FinalPaymentProject,
  origin: FinalPaymentOrigin,
  locale: Locale = routing.defaultLocale
): Promise<string> {
  const metadata = {
    paymentType: "final",
    projectId: project.id,
    // Informative only: the webhook looks the project up by id
    projectCode: project.projectCode,
  } satisfies FinalCheckoutMetadataInput;

  const session = await stripe.checkout.sessions.create({
    locale,
    allowed_payment_method_types: ["card"],
    mode: "payment",
    customer_email: project.email,
    metadata,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${project.planName} - Final Payment (50%)`,
            description: "Final payment upon project completion",
          },
          unit_amount: project.finalAmount,
        },
        quantity: 1,
      },
    ],
    automatic_tax: { enabled: true },
    success_url: `${SITE_BASE_URL}${localizePathname("/payment-complete", locale)}?code=${project.projectCode}`,
    cancel_url:
      origin === "magic-link"
        ? getProjectUrl(project.accessToken, locale)
        : `${SITE_BASE_URL}${localizePathname("/final-payment", locale)}`,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a Checkout URL");
  }

  return session.url;
}
