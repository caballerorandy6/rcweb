import type Stripe from "stripe";
import { SubscriptionStatus } from "@/generated/prisma/enums";

/**
 * Collapses Stripe's subscription lifecycle into the four states the admin
 * dashboard reasons about. Stripe spells it "canceled"; our enum (and the UI
 * filters) use "cancelled", so the raw value must never be stored as-is.
 * Stripe may add statuses; anything unknown is treated as not collecting.
 */
export function toSubscriptionStatus(
  status: Stripe.Subscription.Status
): SubscriptionStatus {
  switch (status) {
    case "active":
    case "trialing":
      return SubscriptionStatus.active;
    case "canceled":
    case "incomplete_expired":
      return SubscriptionStatus.cancelled;
    case "past_due":
      return SubscriptionStatus.past_due;
    case "unpaid":
    case "incomplete":
    case "paused":
    default:
      return SubscriptionStatus.unpaid;
  }
}
