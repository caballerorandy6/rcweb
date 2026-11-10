"use server";

import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { requireAdmin } from "@/lib/authGuard";
import { BillingAddressSchema, formatBillingPlace } from "@/lib/tax/billingAddress";
import { calculateOffStripeTax, type OffStripeTax } from "@/lib/tax/stripeTax";
import type { ActionResult } from "@/types/common";

const EstimateSchema = z.object({
  /** Cents, before tax */
  amount: z.number().int().positive(),
  kind: z.enum(["deposit", "final"]),
  address: BillingAddressSchema,
});

/**
 * Admin: sales tax for a charge paid outside Stripe when there is no billing
 * address on file and the admin types the customer's. The action that
 * records the payment reuses this calculation while the tax still matches.
 */
export async function estimateChargeTaxAction(
  input: z.input<typeof EstimateSchema>
): Promise<ActionResult<OffStripeTax & { place: string }>> {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.authorized) {
      return { success: false, error: authCheck.error };
    }
    const parsed = EstimateSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "Check the address: street, city, two-letter state and ZIP code" };
    }
    const { amount, kind, address } = parsed.data;

    const result = await calculateOffStripeTax({ amount, kind, address });
    if (!result.ok) {
      return { success: false, error: "Stripe Tax could not place that address; check it" };
    }
    return { success: true, data: { ...result.tax, place: formatBillingPlace(address) } };
  } catch (error) {
    Sentry.captureException(error, { tags: { feature: "sales-tax" } });
    return { success: false, error: "Could not calculate the sales tax" };
  }
}
