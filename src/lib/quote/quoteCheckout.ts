import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import stripe from "@/lib/stripe";
import type { Quote } from "@/generated/prisma/client";
import type { Locale } from "@/i18n/routing";
import { createInitialPaymentCheckout } from "@/lib/project/initialPaymentCheckout";

/**
 * A quote is paid once. Every Checkout Session is payable on its own, so a
 * quote keeps a single open one (`Quote.checkoutSessionId`): asking again
 * returns it, and anything that changes or closes the quote expires it.
 */

type QuoteForCheckout = Pick<
  Quote,
  "id" | "planName" | "totalAmount" | "name" | "email" | "checkoutSessionId"
>;

interface QuoteCheckoutOptions {
  description: string;
  cancelUrl: string;
  locale: Locale;
}

export type QuoteCheckout =
  | { kind: "open"; sessionUrl: string }
  /** The last session was paid; the webhook is about to accept the quote */
  | { kind: "paid" };

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

/** Still sells what the quote says now? The admin may have edited it meanwhile */
function matchesQuote(session: Stripe.Checkout.Session, quote: QuoteForCheckout): boolean {
  return (
    session.metadata?.totalAmount === String(quote.totalAmount) &&
    session.metadata?.planName === quote.planName &&
    session.metadata?.customerEmail === quote.email
  );
}

/** The Checkout Session where the customer pays the deposit of this quote */
export async function openQuoteCheckout(
  quote: QuoteForCheckout,
  options: QuoteCheckoutOptions
): Promise<QuoteCheckout> {
  if (quote.checkoutSessionId) {
    const session = await retrieveSession(quote.checkoutSessionId);
    if (session?.status === "complete") return { kind: "paid" };
    if (session?.status === "open") {
      if (session.url && matchesQuote(session, quote)) {
        return { kind: "open", sessionUrl: session.url };
      }
      await expireSession(session.id);
    }
  }

  const created = await createInitialPaymentCheckout({
    planName: quote.planName,
    totalAmount: quote.totalAmount,
    customerName: quote.name,
    customerEmail: quote.email,
    quoteId: quote.id,
    ...options,
  });

  // Remembered only if nobody else opened one since the quote was read
  const { count } = await prisma.quote.updateMany({
    where: { id: quote.id, checkoutSessionId: quote.checkoutSessionId },
    data: { checkoutSessionId: created.sessionId },
  });
  if (count === 1) return { kind: "open", sessionUrl: created.sessionUrl };

  // Two requests at once (two tabs): keep theirs, withdraw this one
  await expireSession(created.sessionId);
  const current = await prisma.quote.findUniqueOrThrow({
    where: { id: quote.id },
    select: { checkoutSessionId: true },
  });
  const theirs = current.checkoutSessionId ? await retrieveSession(current.checkoutSessionId) : null;
  if (theirs?.status === "complete") return { kind: "paid" };
  if (theirs?.status === "open" && theirs.url) return { kind: "open", sessionUrl: theirs.url };
  throw new Error("Could not open a Checkout Session for the quote");
}

/** The quote changed, was cancelled or was paid another way: its open session must not be payable */
export async function expireQuoteCheckout(
  quote: Pick<Quote, "id" | "checkoutSessionId">
): Promise<void> {
  if (!quote.checkoutSessionId) return;
  await expireSession(quote.checkoutSessionId);
  await prisma.quote.updateMany({
    where: { id: quote.id, checkoutSessionId: quote.checkoutSessionId },
    data: { checkoutSessionId: null },
  });
}

/**
 * Reserves a sent quote for the project about to be created from it. The
 * condition travels in the UPDATE, so two confirmations of the same deposit
 * (two tabs, a repeated request) cannot both create a project.
 */
export async function claimQuoteForProject(quoteId: string): Promise<boolean> {
  const { count } = await prisma.quote.updateMany({
    where: { id: quoteId, status: "sent", projectId: null },
    data: { status: "accepted" },
  });
  return count === 1;
}

/** The project could not be created: the quote is open again */
export async function releaseQuoteClaim(quoteId: string): Promise<void> {
  await prisma.quote.updateMany({
    where: { id: quoteId, status: "accepted", projectId: null },
    data: { status: "sent" },
  });
}
