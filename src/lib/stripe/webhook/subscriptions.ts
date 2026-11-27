import type { Resend } from "resend";
import type Stripe from "stripe";
import * as Sentry from "@sentry/nextjs";
import { localizePathname } from "@/i18n/paths";
import { prisma } from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { SITE_BASE_URL } from "@/lib/projectUrl";
import {
  cancellationReason,
  isScheduledToCancel,
  needsAuthentication,
  toSubscriptionStatus,
} from "@/lib/subscriptionStatus";
import {
  sendAdminSubscriptionNotification,
  sendSubscriptionCancellationChange,
  sendSubscriptionCancelled,
  sendSubscriptionPaymentFailed,
  sendSubscriptionRenewalReminder,
} from "@/lib/email";
import type { CustomerLocale } from "@/generated/prisma/enums";

/**
 * The life of a maintenance subscription after its Checkout: renewals,
 * reminders, failed payments, scheduled cancellations and the end.
 *
 * Stripe does not order events and delivers some more than once, so no
 * handler trusts the snapshot inside the event: each one reads the current
 * subscription or invoice from Stripe, and each announcement (an email to the
 * customer or the admin) is claimed in the database before it is sent.
 *
 * A handler answers 2xx with a `warning` for a subscription we have no row
 * for, and throws on a database or Stripe error so the webhook fails and
 * Stripe retries.
 */

export type SubscriptionEventResult = { received: true; warning?: string } & Record<string, unknown>;

const NO_ROW: SubscriptionEventResult = {
  received: true,
  warning: "Subscription not in the database",
};

type EmailResult = { success: boolean; error?: string };

/** Senders never throw; a failed email is reported instead of lost in the response body */
function reportEmailFailures(results: EmailResult[], context: Record<string, unknown>): void {
  for (const result of results) {
    if (result.success) continue;
    Sentry.captureMessage("Subscription email not sent", {
      level: "error",
      tags: { feature: "stripe-webhook" },
      extra: { ...context, error: result.error },
    });
  }
}

function subscriptionIdOf(invoice: Stripe.Invoice): string | null {
  const ref = invoice.parent?.subscription_details?.subscription;
  if (!ref) return null;
  return typeof ref === "string" ? ref : ref.id;
}

/** In Stripe SDK v18+ the billing period lives on the subscription item */
function periodOf(subscription: Stripe.Subscription) {
  const item = subscription.items.data[0];
  return {
    currentPeriodStart: item?.current_period_start ? new Date(item.current_period_start * 1000) : undefined,
    currentPeriodEnd: item?.current_period_end ? new Date(item.current_period_end * 1000) : undefined,
  };
}

const manageUrl = (locale: CustomerLocale) =>
  `${SITE_BASE_URL}${localizePathname("/manage-subscription", locale)}`;

const findRow = (stripeSubscriptionId: string) =>
  prisma.subscription.findUnique({ where: { stripeSubscriptionId } });

/** `invoice.paid` of a renewal: the new period. The first invoice is the signup itself. */
export async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<SubscriptionEventResult> {
  const subscriptionId = subscriptionIdOf(invoice);
  if (!subscriptionId || invoice.billing_reason === "subscription_create") {
    return { received: true };
  }
  if (!(await findRow(subscriptionId))) return NO_ROW;

  const current = await stripe.subscriptions.retrieve(subscriptionId);
  // Ended since this invoice was paid: customer.subscription.deleted owns that
  if (current.status === "canceled") return { received: true, renewed: false };

  const { count } = await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscriptionId, status: { not: "cancelled" } },
    data: { status: toSubscriptionStatus(current.status), ...periodOf(current) },
  });
  return { received: true, renewed: count > 0 };
}

/** `invoice.upcoming`: one reminder per billing period, and none for a plan that is ending */
export async function handleInvoiceUpcoming(
  invoice: Stripe.Invoice,
  resend: Resend
): Promise<SubscriptionEventResult> {
  const subscriptionId = subscriptionIdOf(invoice);
  if (!subscriptionId) return { received: true };

  const subscription = await findRow(subscriptionId);
  if (!subscription) return NO_ROW;
  if (subscription.status !== "active" || subscription.cancelAtPeriodEnd) {
    return { received: true, reminderSent: false };
  }

  const renewalDate = invoice.next_payment_attempt
    ? new Date(invoice.next_payment_attempt * 1000)
    : (subscription.currentPeriodEnd ?? new Date());
  // The period being renewed identifies the reminder
  const period = subscription.currentPeriodEnd ?? renewalDate;

  const claimed = await prisma.subscription.updateMany({
    where: {
      id: subscription.id,
      status: "active",
      cancelAtPeriodEnd: false,
      OR: [{ renewalReminderFor: null }, { renewalReminderFor: { not: period } }],
    },
    data: { renewalReminderFor: period },
  });
  if (claimed.count === 0) return { received: true, reminderSent: false };

  const result = await sendSubscriptionRenewalReminder(resend, {
    customerEmail: subscription.email,
    customerName: subscription.name,
    locale: subscription.locale,
    planName: subscription.planName,
    amount: subscription.amount,
    renewalDate,
    manageUrl: manageUrl(subscription.locale),
  });
  reportEmailFailures([result], { event: "invoice.upcoming", subscriptionId });

  return { received: true, reminderSent: true };
}

/**
 * `invoice.payment_failed`: Stripe sends it for every attempt of its retry
 * schedule, and an attempt's event can arrive after the invoice was paid.
 * The status comes from Stripe as it is now, and the customer and the admin
 * hear about an invoice once.
 */
export async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  resend: Resend
): Promise<SubscriptionEventResult> {
  const subscriptionId = subscriptionIdOf(invoice);
  if (!subscriptionId || !invoice.id) return { received: true };

  const subscription = await findRow(subscriptionId);
  if (!subscription) return NO_ROW;

  const current = await stripe.invoices.retrieve(invoice.id, {
    expand: ["payments.data.payment.payment_intent"],
  });
  // Paid, voided or written off since this attempt failed: nothing is owed on it
  if (current.status !== "open") {
    return { received: true, paymentFailed: false, warning: `Invoice is ${current.status}` };
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
  if (stripeSubscription.status === "canceled") return { received: true, paymentFailed: false };
  const status = toSubscriptionStatus(stripeSubscription.status);

  await prisma.subscription.updateMany({
    where: { id: subscription.id, status: { not: "cancelled" } },
    data: { status },
  });

  const claimed = await prisma.subscription.updateMany({
    where: {
      id: subscription.id,
      OR: [{ paymentFailedInvoiceId: null }, { paymentFailedInvoiceId: { not: invoice.id } }],
    },
    data: { paymentFailedInvoiceId: invoice.id },
  });
  if (claimed.count === 0) return { received: true, paymentFailed: true, notified: false };

  const admin = {
    customerName: subscription.name,
    customerEmail: subscription.email,
    planName: subscription.planName,
    amount: subscription.amount,
    status,
    stripeSubscriptionId: subscription.stripeSubscriptionId,
  };
  const context = { event: "invoice.payment_failed", subscriptionId, invoiceId: invoice.id };

  // 3D Secure: the card is fine, the bank wants a confirmation. Stripe
  // emails the customer a link to confirm (Dashboard → Billing →
  // Subscriptions and emails), so our "update your card" email would
  // give the wrong instruction. Only the admin hears about it.
  if (needsAuthentication(current)) {
    const result = await sendAdminSubscriptionNotification(resend, {
      event: "subscription_payment_action_required",
      ...admin,
    });
    reportEmailFailures([result], context);
    return { received: true, paymentNeedsAuthentication: true, notified: true };
  }

  const customerResult = await sendSubscriptionPaymentFailed(resend, {
    customerEmail: subscription.email,
    customerName: subscription.name,
    locale: subscription.locale,
    planName: subscription.planName,
    amount: subscription.amount,
    updatePaymentUrl: manageUrl(subscription.locale),
  });
  const adminResult = await sendAdminSubscriptionNotification(resend, {
    event: "subscription_payment_failed",
    ...admin,
  });
  reportEmailFailures([customerResult, adminResult], context);

  return { received: true, paymentFailed: true, notified: true };
}

/** `customer.subscription.deleted`: the plan has ended, whoever cancelled it */
export async function handleSubscriptionDeleted(
  stripeSubscription: Stripe.Subscription,
  resend: Resend
): Promise<SubscriptionEventResult> {
  const subscriptionId = stripeSubscription.id;
  // Stripe's own end time, not the delivery time: a retried webhook can arrive hours later
  const endedAt = stripeSubscription.ended_at ? new Date(stripeSubscription.ended_at * 1000) : new Date();

  // Only the request that moves the row to cancelled sends the emails, so
  // a retried or resent event never tells the customer twice.
  const changed = await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscriptionId, status: { not: "cancelled" } },
    data: { status: "cancelled", cancelledAt: endedAt, cancelAtPeriodEnd: false },
  });
  if (changed.count === 0) {
    return { received: true, alreadyCancelled: true };
  }

  const subscription = await prisma.subscription.findUniqueOrThrow({
    where: { stripeSubscriptionId: subscriptionId },
  });

  const customerResult = await sendSubscriptionCancelled(resend, {
    customerEmail: subscription.email,
    customerName: subscription.name,
    locale: subscription.locale,
    planName: subscription.planName,
    endedAt,
  });
  const adminResult = await sendAdminSubscriptionNotification(resend, {
    event: "subscription_cancelled",
    customerName: subscription.name,
    customerEmail: subscription.email,
    planName: subscription.planName,
    amount: subscription.amount,
    status: subscription.status,
    stripeSubscriptionId: subscription.stripeSubscriptionId,
  });
  reportEmailFailures([customerResult, adminResult], {
    event: "customer.subscription.deleted",
    subscriptionId,
  });

  return { received: true, cancelled: true };
}

/**
 * `customer.subscription.updated`: status, period and a cancellation the
 * customer scheduled in the portal or took back. The event only says that
 * something changed; what is written is the subscription as Stripe has it
 * now, so an old update delivered late cannot undo a newer state (above all,
 * it cannot bring a cancelled plan back to active).
 */
export async function handleSubscriptionUpdated(
  eventSubscription: Stripe.Subscription,
  resend: Resend
): Promise<SubscriptionEventResult> {
  const subscriptionId = eventSubscription.id;
  const subscription = await findRow(subscriptionId);
  if (!subscription) return NO_ROW;

  const current = await stripe.subscriptions.retrieve(subscriptionId);
  // Ended: customer.subscription.deleted marks the row and sends the emails
  if (current.status === "canceled") return { received: true, updated: false };

  const scheduled = isScheduledToCancel(current);
  // Flip the flag only if it differs: Stripe can send two updates in the
  // same second (and retries), and only the request that changes the row
  // may announce the change, so the customer never gets it twice.
  const flipped = await prisma.subscription.updateMany({
    where: {
      stripeSubscriptionId: subscriptionId,
      status: { not: "cancelled" },
      cancelAtPeriodEnd: !scheduled,
    },
    data: { cancelAtPeriodEnd: scheduled },
  });

  const period = periodOf(current);
  const status = toSubscriptionStatus(current.status);
  const updated = await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscriptionId, status: { not: "cancelled" } },
    data: { status, ...period },
  });
  if (updated.count === 0) return { received: true, updated: false };

  // The customer scheduled a cancellation in the portal, or took it back:
  // confirm it to them and tell the admin while there is time to talk.
  const change = flipped.count === 0 ? null : scheduled ? "scheduled" : "resumed";
  if (change) {
    const periodEnd = period.currentPeriodEnd ?? subscription.currentPeriodEnd ?? new Date();
    // cancel_at is the real last day; the portal sets it to the period end
    const date = change === "scheduled" && current.cancel_at ? new Date(current.cancel_at * 1000) : periodEnd;

    const customerResult = await sendSubscriptionCancellationChange(resend, {
      kind: change,
      customerEmail: subscription.email,
      customerName: subscription.name,
      locale: subscription.locale,
      planName: subscription.planName,
      date,
      manageUrl: manageUrl(subscription.locale),
    });
    const adminResult = await sendAdminSubscriptionNotification(resend, {
      event: change === "scheduled" ? "subscription_cancel_scheduled" : "subscription_resumed",
      customerName: subscription.name,
      customerEmail: subscription.email,
      planName: subscription.planName,
      amount: subscription.amount,
      status,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      nextBillingDate: date,
      cancellationReason: change === "scheduled" ? cancellationReason(current.cancellation_details) : null,
    });
    reportEmailFailures([customerResult, adminResult], {
      event: "customer.subscription.updated",
      subscriptionId,
      change,
    });
  }

  return { received: true, updated: true };
}
