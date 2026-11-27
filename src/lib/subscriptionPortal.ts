import type { SubscriptionStatus } from "@/generated/prisma/enums";

interface PortalCandidate {
  status: SubscriptionStatus;
  stripeCustomerId: string;
}

/**
 * Which subscriptions of one email get a link to the Stripe Customer Portal.
 * Every Checkout creates its own Stripe customer, so someone who subscribed
 * twice has two portals and needs a link to each plan that is still alive.
 * With nothing alive, the latest one still opens its billing history.
 *
 * `rows` come newest first. One link per Stripe customer: a portal session
 * shows everything that customer has.
 */
export function portalSubscriptions<T extends PortalCandidate>(rows: T[]): T[] {
  const alive = rows.filter((row) => row.status !== "cancelled");
  const chosen = alive.length > 0 ? alive : rows.slice(0, 1);

  const seen = new Set<string>();
  return chosen.filter((row) => {
    if (seen.has(row.stripeCustomerId)) return false;
    seen.add(row.stripeCustomerId);
    return true;
  });
}
