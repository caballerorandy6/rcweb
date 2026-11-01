import type { Metadata, Route } from "next";
import { redirect as redirectExternal } from "next/navigation";
import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import stripe from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Opening your subscription portal…",
  description: "Redirecting to the secure Stripe Customer Portal.",
  robots: { index: false, follow: false },
};

/** 32 random bytes in base64url, as issued by sendPortalLinkAction */
const TOKEN_SHAPE = /^[A-Za-z0-9_-]{43}$/;
type Params = Promise<{ token: string; locale: Locale }>;

/**
 * Magic link from the "Manage Subscription" email. Validates the token and
 * only then creates the Stripe portal session, so the five-minute life of
 * that session starts when the customer clicks, not when the email is sent.
 */
export default async function SubscriptionPortalLinkPage(props: { params: Params }) {
  const { token, locale } = await props.params;
  // Annotated so TypeScript narrows after each call, like redirect() itself
  const fail: (error: string) => never = (error) =>
    redirect({ href: { pathname: "/manage-subscription", query: { error } }, locale });

  if (!TOKEN_SHAPE.test(token)) {
    fail("expired-link");
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
    fail("expired-link");
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
    fail("portal-unavailable");
  }

  redirectExternal(portalUrl as Route);
}
