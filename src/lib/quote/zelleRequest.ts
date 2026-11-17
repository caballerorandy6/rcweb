import * as Sentry from "@sentry/nextjs";
import type { Quote } from "@/generated/prisma/client";
import { splitDepositAmount } from "@/lib/project/charges";
import { parseStoredBillingAddress } from "@/lib/tax/billingAddress";
import { calculateOffStripeTax } from "@/lib/tax/stripeTax";

/** What an edit changes of the Zelle request stored on the quote */
export type ZelleRequestPatch =
  | Record<string, never>
  | { zelleTaxCalculationId: string; zelleTaxAmount: number }
  | { zelleRequestedAt: null; zelleTaxCalculationId: null; zelleTaxAmount: null };

const WITHDRAWN = {
  zelleRequestedAt: null,
  zelleTaxCalculationId: null,
  zelleTaxAmount: null,
} as const;

/**
 * The sales tax of a Zelle request was calculated for the deposit the quote
 * had then. When the admin changes the total, the instructions on the quote
 * page and the calculation recorded in Stripe Tax must follow: the tax is
 * calculated again from the address the customer gave. If that is not
 * possible the request is withdrawn, so the customer asks again and sees the
 * right amount, rather than left with the tax of another price.
 */
export async function zelleRequestAfterEdit(
  quote: Pick<Quote, "id" | "totalAmount" | "billingAddress" | "zelleTaxCalculationId">,
  totalAmount: number
): Promise<ZelleRequestPatch> {
  if (!quote.zelleTaxCalculationId || quote.totalAmount === totalAmount) return {};

  const address = parseStoredBillingAddress(quote.billingAddress);
  if (!address) return WITHDRAWN;

  try {
    const calculated = await calculateOffStripeTax({
      amount: splitDepositAmount(totalAmount).deposit,
      kind: "deposit",
      address,
    });
    if (!calculated.ok) return WITHDRAWN;
    return {
      zelleTaxCalculationId: calculated.tax.calculationId,
      zelleTaxAmount: calculated.tax.taxAmount,
    };
  } catch (error) {
    Sentry.captureException(error, { tags: { feature: "sales-tax" }, extra: { quoteId: quote.id } });
    return WITHDRAWN;
  }
}
