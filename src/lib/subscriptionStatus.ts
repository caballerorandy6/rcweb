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

/**
 * Whether a still-active subscription will end on its own. The portal cancels
 * at the end of the period (`cancel_at_period_end`); the Dashboard can also set
 * a custom date (`cancel_at`). Both clear when the customer reactivates.
 */
export function isScheduledToCancel(
  subscription: Pick<Stripe.Subscription, "cancel_at_period_end" | "cancel_at">
): boolean {
  return subscription.cancel_at_period_end || subscription.cancel_at !== null;
}

/** The portal's cancellation survey, readable in the admin notification */
export function cancellationReason(
  details: Pick<
    Stripe.Subscription.CancellationDetails,
    "feedback" | "comment"
  > | null
): string | null {
  if (!details?.feedback) return null;
  const reason = details.feedback.replace(/_/g, " ");
  return details.comment ? `${reason}: "${details.comment}"` : reason;
}

/**
 * A renewal that "failed" only because the bank wants the customer to confirm
 * it (3D Secure): the card works, so asking them to change it would be wrong.
 * Stripe emails them a confirmation link instead. Needs the invoice retrieved
 * with `expand: ["payments.data.payment.payment_intent"]`.
 */
export function needsAuthentication(invoice: Stripe.Invoice): boolean {
  return (invoice.payments?.data ?? []).some(({ payment }) => {
    const intent = payment.payment_intent;
    return typeof intent === "object" && intent?.status === "requires_action";
  });
}
