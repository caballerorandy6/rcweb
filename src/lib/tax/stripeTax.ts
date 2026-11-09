import Stripe from "stripe";
import stripe from "@/lib/stripe";
import type { PaymentKind } from "@/generated/prisma/enums";
import type { BillingAddress } from "./billingAddress";
import { buildTaxCalculationParams } from "./offStripeTax";

export type OffStripeTax = {
  calculationId: string;
  /** Cents to add on top of the charge; 0 outside the states where we collect */
  taxAmount: number;
};

export type OffStripeTaxResult =
  | { ok: true; tax: OffStripeTax }
  // Stripe could not place the address (typo in the ZIP code, unknown city)
  | { ok: false; reason: "invalid_location" };

/** Sales tax for a charge the customer pays outside Stripe (Zelle, cash) */
export async function calculateOffStripeTax(input: {
  amount: number;
  kind: PaymentKind;
  address: BillingAddress;
}): Promise<OffStripeTaxResult> {
  try {
    const calculation = await stripe.tax.calculations.create(buildTaxCalculationParams(input));
    if (!calculation.id) {
      throw new Error("Stripe returned a tax calculation without an id");
    }
    return {
      ok: true,
      tax: { calculationId: calculation.id, taxAmount: calculation.tax_amount_exclusive },
    };
  } catch (error) {
    if (
      error instanceof Stripe.errors.StripeError &&
      error.code === "customer_tax_location_invalid"
    ) {
      return { ok: false, reason: "invalid_location" };
    }
    throw error;
  }
}

/**
 * Records the sale in Stripe Tax once the money has arrived, so it appears in
 * the tax reports. The reference doubles as idempotency key: a retry returns
 * the same transaction instead of a second one. Calculations expire after
 * 90 days.
 */
export async function recordOffStripeTax({
  calculationId,
  reference,
}: {
  calculationId: string;
  reference: string;
}): Promise<string> {
  const transaction = await stripe.tax.transactions.createFromCalculation(
    { calculation: calculationId, reference },
    { idempotencyKey: `tax-transaction-${reference}` }
  );
  return transaction.id;
}
