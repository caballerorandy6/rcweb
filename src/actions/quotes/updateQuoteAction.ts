"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import { QuoteInputSchema, type QuoteInput } from "@/lib/zod";
import { isQuoteOpen } from "@/lib/quote/quoteStatus";
import { toAdminQuote } from "@/lib/quote/toAdminQuote";
import type { AdminQuote } from "@/types/quote";
import type { ActionResult } from "@/types/common";

/**
 * Edits a draft or sent quote. The public link always shows the current
 * version; re-send it so the customer gets the update by email.
 */
export async function updateQuoteAction(
  quoteId: string,
  input: QuoteInput
): Promise<ActionResult<{ quote: AdminQuote }>> {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.authorized) {
      return { success: false, error: authCheck.error };
    }

    const parsed = QuoteInputSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid quote data",
      };
    }
    const data = parsed.data;

    const current = await prisma.quote.findUnique({
      where: { id: quoteId },
      select: { status: true },
    });
    if (!current) {
      return { success: false, error: "Quote not found" };
    }
    if (!isQuoteOpen(current)) {
      return { success: false, error: `A ${current.status} quote cannot be edited` };
    }

    const quote = await prisma.quote.update({
      where: { id: quoteId },
      data: {
        email: data.email,
        name: data.name,
        offerId: data.offerId || null,
        planName: data.planName,
        scope: data.scope,
        notes: data.notes || null,
        totalAmount: Math.round(data.totalDollars * 100),
        ...(data.contactId && { contactId: data.contactId }),
      },
      include: { project: { select: { projectCode: true } } },
    });

    revalidatePath("/quotes");

    return { success: true, data: { quote: toAdminQuote(quote) } };
  } catch (error) {
    console.error("Error updating quote:", error);
    return { success: false, error: "Failed to update quote" };
  }
}
