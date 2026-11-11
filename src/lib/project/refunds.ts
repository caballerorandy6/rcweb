import type { Payment } from "@/generated/prisma/client";
import type { DisputeStatus, PaymentStatus } from "@/generated/prisma/enums";
import type Stripe from "stripe";
import { chargeTotal } from "./charges";

/**
 * Pure rules for money that goes back to the customer, applied by the Stripe
 * webhook (refunds and disputes) and read by the revenue figures. Amounts are
 * cents; `refundedAmount` is tax included, like Stripe's `amount_refunded`.
 */

type RefundablePayment = Pick<Payment, "status" | "amount" | "taxAmount" | "refundedAmount" | "refundedAt">;

export type RefundPatch = {
  status: PaymentStatus;
  refundedAmount: number;
  refundedAt: Date;
};

function patchFor(payment: RefundablePayment, refundedAmount: number, full: boolean, at: Date): RefundPatch {
  return {
    status: full || refundedAmount >= chargeTotal(payment) ? "refunded" : "paid",
    refundedAmount,
    refundedAt: payment.refundedAt ?? at,
  };
}

/**
 * What a `charge.refunded` event changes. Stripe sends the cumulative
 * `amount_refunded`, so the same event can arrive twice (or out of order)
 * and the result stays the same. Returns null when nothing changes.
 */
export function applyRefund(
  payment: RefundablePayment,
  charge: { amountRefunded: number; refunded: boolean },
  at: Date
): RefundPatch | null {
  if (payment.status === "pending") return null;
  if (charge.amountRefunded <= payment.refundedAmount) return null;
  return patchFor(payment, charge.amountRefunded, charge.refunded, at);
}

/**
 * A lost dispute takes the disputed amount out of the account without a
 * refund object, so it is counted here on top of any earlier refund.
 */
export function applyLostDispute(payment: RefundablePayment, disputedAmount: number, at: Date): RefundPatch | null {
  if (payment.status === "pending") return null;
  const refundedAmount = Math.min(chargeTotal(payment), payment.refundedAmount + disputedAmount);
  if (refundedAmount <= payment.refundedAmount) return null;
  return patchFor(payment, refundedAmount, false, at);
}

/** The part of `refundedAmount` that was revenue (the rest was sales tax) */
export function netRefunded(payment: Pick<Payment, "status" | "amount" | "taxAmount" | "refundedAmount">): number {
  if (payment.status === "refunded") return payment.amount;
  const total = chargeTotal(payment);
  if (total === 0 || payment.refundedAmount === 0) return 0;
  return Math.min(payment.amount, Math.round((payment.refundedAmount * payment.amount) / total));
}

/** Revenue the admin can count on from a charge: what was paid minus what went back */
export function recognizedRevenue(payment: Pick<Payment, "status" | "amount" | "taxAmount" | "refundedAmount">): number {
  if (payment.status !== "paid") return 0;
  return payment.amount - netRefunded(payment);
}

/** Collapses Stripe's seven dispute statuses into the three the admin cares about */
export function toDisputeStatus(status: Stripe.Dispute.Status): DisputeStatus {
  switch (status) {
    case "won":
    case "warning_closed":
      return "won";
    case "lost":
      return "lost";
    default:
      return "open";
  }
}
