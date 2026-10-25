"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import { sendQuote } from "@/lib/quote/sendQuote";
import { toAdminQuote } from "@/lib/quote/toAdminQuote";
import type { AdminQuote } from "@/types/quote";
import type { ActionResult } from "@/types/common";

/** Sends (or re-sends, extending the validity) the quote to the customer. */
export async function sendQuoteAction(
  quoteId: string
): Promise<ActionResult<{ quote: AdminQuote }>> {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.authorized) {
      return { success: false, error: authCheck.error };
    }

    const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
    if (!quote) {
      return { success: false, error: "Quote not found" };
    }

    const sent = await sendQuote(quote);
    if (!sent.success) {
      return { success: false, error: sent.error };
    }

    revalidatePath("/quotes");
    revalidatePath("/contacts");

    return {
      success: true,
      data: { quote: toAdminQuote({ ...sent.quote, project: null }) },
    };
  } catch (error) {
    console.error("Error sending quote:", error);
    return { success: false, error: "Failed to send quote" };
  }
}
