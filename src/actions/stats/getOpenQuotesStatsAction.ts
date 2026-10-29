"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";

export interface OpenQuotesStats {
  /** Sent quotes the customer can still accept (same rule as the Quotes page) */
  open: number;
  /** Their total in cents */
  openValue: number;
  /** Quotes written but not sent yet */
  drafts: number;
}

/** Pipeline value: what has been quoted and is still on the table */
export async function getOpenQuotesStatsAction(): Promise<OpenQuotesStats> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    throw new Error(authCheck.error);
  }

  const now = new Date();
  const [open, drafts] = await Promise.all([
    prisma.quote.aggregate({
      where: { status: "sent", expiresAt: { gt: now } },
      _count: { _all: true },
      _sum: { totalAmount: true },
    }),
    prisma.quote.count({ where: { status: "draft" } }),
  ]);

  return {
    open: open._count._all,
    openValue: open._sum.totalAmount ?? 0,
    drafts,
  };
}
