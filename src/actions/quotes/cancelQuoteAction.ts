"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import { isQuoteOpen } from "@/lib/quote/quoteStatus";
import { toAdminQuote } from "@/lib/quote/toAdminQuote";
import type { AdminQuote } from "@/types/quote";
import type { ActionResult } from "@/types/common";

/** Withdraws a draft or sent quote; the public link stops offering payment. */
export async function cancelQuoteAction(
  quoteId: string
): Promise<ActionResult<{ quote: AdminQuote }>> {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.authorized) {
      return { success: false, error: authCheck.error };
    }

    const current = await prisma.quote.findUnique({
      where: { id: quoteId },
      select: { status: true },
    });
    if (!current) {
      return { success: false, error: "Quote not found" };
    }
    if (!isQuoteOpen(current)) {
      return { success: false, error: `A ${current.status} quote cannot be cancelled` };
    }

    const quote = await prisma.quote.update({
      where: { id: quoteId },
      data: { status: "cancelled" },
      include: { project: { select: { projectCode: true } } },
    });

    revalidatePath("/quotes");

    return { success: true, data: { quote: toAdminQuote(quote) } };
  } catch (error) {
    console.error("Error cancelling quote:", error);
    return { success: false, error: "Failed to cancel quote" };
  }
}
