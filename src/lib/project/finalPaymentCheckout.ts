import type Stripe from "stripe";
import { emailTranslator } from "@/lib/email/i18n";
import { prisma } from "@/lib/prisma";
import stripe from "@/lib/stripe";
import type { Payment } from "@/generated/prisma/client";
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
}

/** Where the customer came from; cancelling sends them back there. */
export type FinalPaymentOrigin = "form" | "magic-link";

export type FinalPaymentCheckout =
  | { kind: "open"; sessionUrl: string }
  /** Nothing left to pay: the charge is settled, or its session was just paid */
  | { kind: "paid" };

type FinalCharge = Pick<Payment, "id" | "amount" | "status" | "checkoutSessionId">;

function cancelUrlFor(project: FinalPaymentProject, origin: FinalPaymentOrigin, locale: Locale): string {
  return origin === "magic-link"
    ? getProjectUrl(project.accessToken, locale)
    : `${SITE_BASE_URL}${localizePathname("/final-payment", locale)}`;
}

async function createSession(
  project: FinalPaymentProject,
  amount: number,
  origin: FinalPaymentOrigin,
  locale: Locale
): Promise<{ sessionId: string; sessionUrl: string }> {
  const t = emailTranslator(locale);
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
    // A real Customer (not a guest) gives the payment a recipient email, so
    // Stripe can email the refund receipt; payment receipts stay off in the
    // Dashboard because our own invoice covers them
    customer_creation: "always",
    metadata,
    // Copied onto the PaymentIntent, so the charge (what refunds and disputes
    // point at) names the project in the Stripe dashboard
    payment_intent_data: {
      metadata: { projectCode: project.projectCode, paymentType: "final" },
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: t("checkout.finalName", { planName: project.planName }),
            description: t("checkout.finalDescription"),
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    automatic_tax: { enabled: true },
    success_url: `${SITE_BASE_URL}${localizePathname("/payment-complete", locale)}?code=${project.projectCode}`,
    cancel_url: cancelUrlFor(project, origin, locale),
  });

  if (!session.url) {
    throw new Error("Stripe did not return a Checkout URL");
  }

  return { sessionId: session.id, sessionUrl: session.url };
}

async function retrieveSession(sessionId: string): Promise<Stripe.Checkout.Session | null> {
  try {
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    // Unknown to this Stripe account (another environment) or deleted
    return null;
  }
}

async function expireSession(sessionId: string): Promise<void> {
  try {
    await stripe.checkout.sessions.expire(sessionId);
  } catch {
    // Only open sessions can be expired: it was paid or had expired already
  }
}

/**
 * The Checkout Session where the customer pays the final 50 %. Callers verify
 * access first (email + project code behind a rate limit, or the access
 * token) and check that the project is ready for payment.
 *
 * Every Checkout Session is payable on its own, so the charge keeps a single
 * open one (`Payment.checkoutSessionId`): asking again (a second visit to the
 * magic link, another tab, the form) returns it instead of opening another
 * that could also be paid.
 */
export async function openFinalPaymentCheckout(
  project: FinalPaymentProject,
  origin: FinalPaymentOrigin,
  locale: Locale = routing.defaultLocale
): Promise<FinalPaymentCheckout> {
  // Read here, not by the caller: what matters is the charge as it is now
  const charge: FinalCharge = await prisma.payment.findUniqueOrThrow({
    where: { projectId_kind: { projectId: project.id, kind: "final" } },
    select: { id: true, amount: true, status: true, checkoutSessionId: true },
  });
  // Paid, or paid and refunded: either way there is nothing to charge
  if (charge.status !== "pending") return { kind: "paid" };

  if (charge.checkoutSessionId) {
    const session = await retrieveSession(charge.checkoutSessionId);
    if (session?.status === "complete") return { kind: "paid" };
    if (session?.status === "open") {
      const sameSale =
        session.amount_subtotal === charge.amount &&
        session.customer_email === project.email &&
        session.locale === locale &&
        session.cancel_url === cancelUrlFor(project, origin, locale);
      if (session.url && sameSale) return { kind: "open", sessionUrl: session.url };
      // Another language or way back: replaced, never left open beside the new one
      await expireSession(session.id);
    }
  }

  const created = await createSession(project, charge.amount, origin, locale);

  // Remembered only if the charge is still unpaid and nobody else opened one
  // since it was read
  const { count } = await prisma.payment.updateMany({
    where: { id: charge.id, status: "pending", checkoutSessionId: charge.checkoutSessionId },
    data: { checkoutSessionId: created.sessionId },
  });
  if (count === 1) return { kind: "open", sessionUrl: created.sessionUrl };

  // Two requests at once (two tabs), or paid meanwhile: withdraw this one
  await expireSession(created.sessionId);
  const current = await prisma.payment.findUniqueOrThrow({
    where: { id: charge.id },
    select: { status: true, checkoutSessionId: true },
  });
  if (current.status !== "pending") return { kind: "paid" };
  const theirs = current.checkoutSessionId ? await retrieveSession(current.checkoutSessionId) : null;
  if (theirs?.status === "complete") return { kind: "paid" };
  if (theirs?.status === "open" && theirs.url) return { kind: "open", sessionUrl: theirs.url };
  throw new Error("Could not open a Checkout Session for the final payment");
}

/**
 * The balance arrived another way (Zelle, cash): the open session must stop
 * being payable before the charge is recorded. Returns "paid" when the
 * customer has just paid it by card, so the admin does not record it twice.
 */
export async function closeFinalPaymentCheckout(
  charge: Pick<Payment, "id" | "checkoutSessionId">
): Promise<"closed" | "paid"> {
  if (!charge.checkoutSessionId) return "closed";

  const session = await retrieveSession(charge.checkoutSessionId);
  if (session?.status === "complete") return "paid";
  if (session?.status === "open") {
    await expireSession(session.id);
    // Paid in the instant between reading it and expiring it
    const after = await retrieveSession(session.id);
    if (after?.status === "complete") return "paid";
  }

  await prisma.payment.updateMany({
    where: { id: charge.id, checkoutSessionId: charge.checkoutSessionId },
    data: { checkoutSessionId: null },
  });
  return "closed";
}
