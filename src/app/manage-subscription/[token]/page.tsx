import type { Metadata } from "next";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import stripe from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Opening your subscription portal…",
  description: "Redirecting to the secure Stripe Customer Portal.",
  robots: { index: false, follow: false },
};

/** 32 random bytes in base64url, as issued by sendPortalLinkAction */
const TOKEN_SHAPE = /^[A-Za-z0-9_-]{43}$/;
const EXPIRED = "/manage-subscription?error=expired-link" as Route;

type Params = Promise<{ token: string }>;

/**
 * Magic link from the "Manage Subscription" email. Validates the token and
 * only then creates the Stripe portal session, so the five-minute life of
 * that session starts when the customer clicks, not when the email is sent.
 */
export default async function SubscriptionPortalLinkPage(props: { params: Params }) {
  const { token } = await props.params;

  if (!TOKEN_SHAPE.test(token)) {
    redirect(EXPIRED);
  }

  const subscription = await prisma.subscription.findUnique({
    where: { portalToken: token },
    select: { stripeCustomerId: true, portalTokenExpiresAt: true },
  });

  if (
    !subscription ||
    !subscription.portalTokenExpiresAt ||
    subscription.portalTokenExpiresAt < new Date()
  ) {
    redirect(EXPIRED);
  }

  let portalUrl: string;
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });
    portalUrl = session.url;
  } catch (error) {
    console.error("❌ Could not create Stripe portal session:", error);
    redirect("/manage-subscription?error=portal-unavailable" as Route);
  }

  redirect(portalUrl as Route);
}
