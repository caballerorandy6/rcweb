"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import { toAdminQuote } from "@/lib/quote/toAdminQuote";
import type { AdminQuote } from "@/types/quote";
import type { ActionResult } from "@/types/common";

export async function getAllQuotesAction(): Promise<
  ActionResult<{ quotes: AdminQuote[] }>
> {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.authorized) {
      return { success: false, error: authCheck.error };
    }

    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: "desc" },
      include: { project: { select: { projectCode: true } } },
    });

    const now = new Date();
    return {
      success: true,
      data: { quotes: quotes.map((quote) => toAdminQuote(quote, now)) },
    };
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return { success: false, error: "Failed to fetch quotes" };
  }
}
