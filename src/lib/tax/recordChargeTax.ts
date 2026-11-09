import * as Sentry from "@sentry/nextjs";
import type { PaymentKind } from "@/generated/prisma/enums";
import { formatCurrency } from "@/lib/utils";
import type { BillingAddress } from "./billingAddress";
import { isCalculationFresh, taxTransactionReference } from "./offStripeTax";
import { calculateOffStripeTax, recordOffStripeTax } from "./stripeTax";

export type RecordChargeTaxResult = { transactionId: string } | { warning: string };

/**
 * Records in Stripe Tax a charge paid outside Stripe (Zelle, cash), so it is
 * in the tax reports like a Checkout payment. Uses the calculation the
 * customer saw when it still matches the tax the admin entered; otherwise
 * calculates again from the billing address. Records sales with zero tax
 * too, since Stripe counts them toward other states' thresholds.
 *
 * Never throws: the money is already in the bank and the project must go
 * ahead, so problems come back as a warning for the admin (and Sentry).
 */
export async function recordChargeTax({
  projectCode,
  kind,
  amount,
  taxAmount,
  address,
  calculation,
  now = new Date(),
}: {
  projectCode: string;
  kind: PaymentKind;
  /** Cents, before tax */
  amount: number;
  /** Cents of tax the admin says the customer paid */
  taxAmount: number;
  address: BillingAddress | null;
  /** Calculation shown to the customer, if any (Zelle request on the quote) */
  calculation?: { id: string; taxAmount: number; calculatedAt: Date } | null;
  now?: Date;
}): Promise<RecordChargeTaxResult> {
  const notRecorded = "This sale is not in Stripe Tax; report it yourself.";
  if (!address) {
    return { warning: `No billing address on file. ${notRecorded}` };
  }

  try {
    let calculationId: string;
    if (
      calculation &&
      calculation.taxAmount === taxAmount &&
      isCalculationFresh(calculation.calculatedAt, now)
    ) {
      calculationId = calculation.id;
    } else {
      const calculated = await calculateOffStripeTax({ amount, kind, address });
      if (!calculated.ok) {
        return { warning: `Stripe Tax could not place the billing address. ${notRecorded}` };
      }
      if (calculated.tax.taxAmount !== taxAmount) {
        return {
          warning: `Stripe Tax calculates ${formatCurrency(calculated.tax.taxAmount)} of tax for this address, but ${formatCurrency(taxAmount)} was entered. ${notRecorded}`,
        };
      }
      calculationId = calculated.tax.calculationId;
    }

    const transactionId = await recordOffStripeTax({
      calculationId,
      reference: taxTransactionReference(projectCode, kind),
    });
    return { transactionId };
  } catch (error) {
    Sentry.captureException(error, { tags: { feature: "sales-tax" }, extra: { projectCode, kind } });
    const message = error instanceof Error ? error.message : String(error);
    return { warning: `Could not record the sale in Stripe Tax (${message}). ${notRecorded}` };
  }
}
