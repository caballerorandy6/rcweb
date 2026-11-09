import type Stripe from "stripe";
import type { PaymentKind } from "@/generated/prisma/enums";
import { toStripeAddress, type BillingAddress } from "./billingAddress";

// Sales tax on a charge paid outside Stripe (Zelle, cash), following
// https://docs.stripe.com/tax/off-stripe: a Tax Calculation gives the amount
// to ask for, and once the money arrives it becomes a Tax Transaction so the
// sale shows up in the Stripe Tax reports. Checkout records its own.

/**
 * Parameters for stripe.tax.calculations.create. No tax_code: like the
 * Checkout sessions, the line uses the account's preset (Website Design).
 * Prices are before tax, so the tax is added on top.
 */
export function buildTaxCalculationParams({
  amount,
  kind,
  address,
}: {
  amount: number;
  kind: PaymentKind;
  address: BillingAddress;
}): Stripe.Tax.CalculationCreateParams {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error(`Tax calculation needs a positive amount in cents, got ${amount}`);
  }

  return {
    currency: "usd",
    line_items: [{ amount, reference: kind, tax_behavior: "exclusive" }],
    customer_details: {
      address: toStripeAddress(address),
      address_source: "billing",
    },
  };
}

/** Reference of the Tax Transaction in the Stripe Tax exports: one per Payment row */
export function taxTransactionReference(projectCode: string, kind: PaymentKind): string {
  return `${projectCode}-${kind}`;
}

/** Stripe keeps a calculation for 90 days; stop using it a day before */
const CALCULATION_MAX_AGE_MS = 89 * 24 * 60 * 60 * 1000;

/** Whether a calculation made at `calculatedAt` can still become a tax transaction */
export function isCalculationFresh(calculatedAt: Date, now: Date = new Date()): boolean {
  return now.getTime() - calculatedAt.getTime() < CALCULATION_MAX_AGE_MS;
}
