import type { Resend } from "resend";
import type Stripe from "stripe";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { sendAdminPaymentIssueNotification } from "@/lib/email";
import type { PaymentIssueKind } from "@/lib/email";
import { chargeTotal } from "@/lib/project/charges";
import { applyLostDispute, applyRefund, toDisputeStatus } from "@/lib/project/refunds";
import { SITE_BASE_URL } from "@/lib/projectUrl";
import { ADMIN_ROUTES } from "@/config/adminRoutes";

/**
 * Refunds and disputes (chargebacks) on the two charges of a 50/50 project.
 * Stripe names the Charge and its PaymentIntent in these events, never the
 * Checkout Session, so the Payment row is found through
 * `stripePaymentIntentId` (filled since this code shipped) and, for older
 * rows, through the session that created that PaymentIntent.
 *
 * Every handler returns what the webhook answers to Stripe; it only throws
 * for a database error, so Stripe retries.
 */

export type PaymentIssueResult = {
  received: true;
  /** Why nothing was recorded; a 2xx with this is still the right answer to Stripe */
  warning?: string;
  /**
   * The charge belongs to one of our Checkout Sessions whose
   * `checkout.session.completed` has not been processed yet (Stripe does not
   * order events). The webhook answers non-2xx so Stripe retries later.
   */
  retry?: true;
  updated?: boolean;
  emailError?: string;
};

const NOT_YET_RECORDED: PaymentIssueResult = {
  received: true,
  retry: true,
  warning: "Project payment not recorded yet; retry",
};

const CHARGE_LABELS = { deposit: "Deposit (50%)", final: "Final payment (50%)" } as const;

const paymentInclude = {
  project: {
    select: { id: true, projectCode: true, name: true, email: true, planName: true, status: true },
  },
} as const;

type PaymentWithProject = NonNullable<
  Awaited<ReturnType<typeof findPaymentByPaymentIntent>>
>;

function findPaymentByPaymentIntent(paymentIntentId: string) {
  return prisma.payment.findUnique({
    where: { stripePaymentIntentId: paymentIntentId },
    include: paymentInclude,
  });
}

function idOf(ref: string | { id: string } | null | undefined): string | null {
  if (!ref) return null;
  return typeof ref === "string" ? ref : ref.id;
}

export type ChargeLookup =
  | { kind: "found"; payment: PaymentWithProject }
  /** One of our project sessions, but its completed event has not been processed yet */
  | { kind: "pending" }
  /** Subscriptions, Payment Links, Dashboard charges… nothing to record */
  | { kind: "foreign" };

/**
 * The Payment behind a Stripe charge. Rows created before the PaymentIntent
 * was stored are matched through their Checkout Session and backfilled.
 */
export async function findPaymentForCharge(paymentIntentId: string | null): Promise<ChargeLookup> {
  if (!paymentIntentId) return { kind: "foreign" };

  const byIntent = await findPaymentByPaymentIntent(paymentIntentId);
  if (byIntent) return { kind: "found", payment: byIntent };

  const sessions = await stripe.checkout.sessions.list({ payment_intent: paymentIntentId, limit: 1 });
  const session = sessions.data[0];
  if (!session) return { kind: "foreign" };

  const bySession = await prisma.payment.findUnique({
    where: { stripeSessionId: session.id },
    include: paymentInclude,
  });
  if (!bySession) {
    const paymentType = session.metadata?.paymentType;
    return paymentType === "initial" || paymentType === "final" ? { kind: "pending" } : { kind: "foreign" };
  }

  const payment = await prisma.payment.update({
    where: { id: bySession.id },
    data: { stripePaymentIntentId: paymentIntentId },
    include: paymentInclude,
  });
  return { kind: "found", payment };
}

function notFound(lookup: Exclude<ChargeLookup, { kind: "found" }>, what: string): PaymentIssueResult {
  return lookup.kind === "pending"
    ? NOT_YET_RECORDED
    : { received: true, warning: `${what} on a charge that is not a project payment` };
}

async function notify(
  resend: Resend,
  payment: PaymentWithProject,
  kind: PaymentIssueKind,
  details: { amount: number; reason?: string; respondBy?: Date; stripeUrl: string }
): Promise<string | undefined> {
  const result = await sendAdminPaymentIssueNotification(resend, {
    kind,
    projectCode: payment.project.projectCode,
    customerName: payment.project.name,
    customerEmail: payment.project.email,
    planName: payment.project.planName,
    chargeLabel: CHARGE_LABELS[payment.kind],
    chargeTotal: chargeTotal(payment),
    adminProjectUrl: `${SITE_BASE_URL}${ADMIN_ROUTES.projects}/${payment.project.id}`,
    ...details,
  });
  return result.success ? undefined : result.error;
}

const paymentUrl = (paymentIntentId: string) => `https://dashboard.stripe.com/payments/${paymentIntentId}`;
const disputeUrl = (disputeId: string) => `https://dashboard.stripe.com/disputes/${disputeId}`;

/** `charge.refunded`: Stripe sends the cumulative amount, so this is idempotent */
export async function handleChargeRefunded(
  charge: Stripe.Charge,
  resend: Resend,
  now = new Date()
): Promise<PaymentIssueResult> {
  const paymentIntentId = idOf(charge.payment_intent);
  const lookup = await findPaymentForCharge(paymentIntentId);
  if (lookup.kind !== "found") return notFound(lookup, "Refund");
  const { payment } = lookup;

  const patch = applyRefund(
    payment,
    { amountRefunded: charge.amount_refunded, refunded: charge.refunded },
    now
  );
  if (!patch) {
    return { received: true, updated: false };
  }

  await prisma.payment.update({ where: { id: payment.id }, data: patch });

  const emailError = await notify(resend, payment, "refund", {
    amount: patch.refundedAmount,
    stripeUrl: paymentUrl(paymentIntentId as string),
  });
  return { received: true, updated: true, ...(emailError && { emailError }) };
}

/** `charge.dispute.created`: record it and get the admin to respond in time */
export async function handleDisputeCreated(
  dispute: Stripe.Dispute,
  resend: Resend
): Promise<PaymentIssueResult> {
  const lookup = await findPaymentForCharge(idOf(dispute.payment_intent));
  if (lookup.kind !== "found") return notFound(lookup, "Dispute");
  const { payment } = lookup;

  const status = toDisputeStatus(dispute.status);
  if (payment.disputeId === dispute.id && payment.disputeStatus === status) {
    return { received: true, updated: false };
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { disputeId: dispute.id, disputeStatus: status },
  });

  const dueBy = dispute.evidence_details?.due_by;
  const emailError = await notify(resend, payment, "dispute_opened", {
    amount: dispute.amount,
    reason: dispute.reason,
    respondBy: dueBy ? new Date(dueBy * 1000) : undefined,
    stripeUrl: disputeUrl(dispute.id),
  });
  return { received: true, updated: true, ...(emailError && { emailError }) };
}

/** `charge.dispute.closed`: won keeps the charge paid, lost counts as money returned */
export async function handleDisputeClosed(
  dispute: Stripe.Dispute,
  resend: Resend,
  now = new Date()
): Promise<PaymentIssueResult> {
  const lookup = await findPaymentForCharge(idOf(dispute.payment_intent));
  if (lookup.kind !== "found") return notFound(lookup, "Dispute");
  const { payment } = lookup;

  const status = toDisputeStatus(dispute.status);
  if (status === "open") {
    // Stripe closes a dispute as won or lost; anything else is unexpected
    Sentry.captureMessage("Dispute closed with an open status", {
      level: "warning",
      extra: { disputeId: dispute.id, status: dispute.status },
    });
    return { received: true, warning: `Dispute closed with status ${dispute.status}` };
  }
  if (payment.disputeId === dispute.id && payment.disputeStatus === status) {
    return { received: true, updated: false };
  }

  const refund = status === "lost" ? applyLostDispute(payment, dispute.amount, now) : null;
  await prisma.payment.update({
    where: { id: payment.id },
    data: { disputeId: dispute.id, disputeStatus: status, ...refund },
  });

  const emailError = await notify(resend, payment, status === "won" ? "dispute_won" : "dispute_lost", {
    amount: dispute.amount,
    reason: dispute.reason,
    stripeUrl: disputeUrl(dispute.id),
  });
  return { received: true, updated: true, ...(emailError && { emailError }) };
}
