"use server";

import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import { getProjectCharges } from "@/lib/project/charges";
import { formatBillingPlace, parseStoredBillingAddress } from "@/lib/tax/billingAddress";
import { calculateOffStripeTax } from "@/lib/tax/stripeTax";
import type { ActionResult } from "@/types/common";

export type ChargeTaxPreview =
  /** Stripe Tax's amount for the project's billing address */
  | { taxAmount: number; place: string }
  /** Nothing to suggest: no address on file (the admin types it), or Stripe could not place it */
  | { taxAmount: null; reason: string; needsAddress: boolean };

/**
 * Admin: the sales tax a charge paid outside Stripe should carry, so the
 * "Record payment" dialog can suggest it. Calculated from the billing address
 * the customer gave with the deposit (Checkout or the Zelle request).
 */
export async function previewChargeTaxAction(
  projectId: string,
  kind: "deposit" | "final"
): Promise<ActionResult<ChargeTaxPreview>> {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.authorized) {
      return { success: false, error: authCheck.error };
    }
    if (!z.uuid().safeParse(projectId).success) {
      return { success: false, error: "Invalid project" };
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { payments: true },
    });
    if (!project) {
      return { success: false, error: "Project not found" };
    }

    const address = parseStoredBillingAddress(project.billingAddress);
    if (!address) {
      return { success: true, data: { taxAmount: null, reason: "No billing address on file", needsAddress: true } };
    }

    const charge = getProjectCharges(project.payments)[kind];
    const result = await calculateOffStripeTax({ amount: charge.amount, kind, address });
    if (!result.ok) {
      return {
        success: true,
        data: {
          taxAmount: null,
          reason: "Stripe Tax could not place the billing address on file",
          needsAddress: false,
        },
      };
    }
    return {
      success: true,
      data: { taxAmount: result.tax.taxAmount, place: formatBillingPlace(address) },
    };
  } catch (error) {
    Sentry.captureException(error, { tags: { feature: "sales-tax" }, extra: { projectId, kind } });
    return { success: false, error: "Could not calculate the sales tax" };
  }
}
