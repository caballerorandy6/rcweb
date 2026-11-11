"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import { netRefunded } from "@/lib/project/refunds";

/** All amounts in cents, like `Payment.amount`; format with `formatCurrency()` */
export interface RevenueStats {
  /** Every paid charge (deposits and final payments), minus what was refunded */
  totalRevenue: number;
  /** Paid charges whose `paidAt` falls in the current calendar month, minus refunds */
  thisMonthRevenue: number;
  /** Charges still due: unpaid deposits plus final payments of projects marked ready */
  pendingPayments: number;
  pendingAmount: number;
}

/**
 * The one revenue figure for the admin: the sum of paid `Payment` rows minus
 * the revenue part of partial refunds (a fully refunded charge is no longer
 * `paid`). The dashboard and the invoices page both read it, so they agree.
 */
export async function getRevenueStatsAction(): Promise<RevenueStats> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    throw new Error(authCheck.error);
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [paid, paidThisMonth, partialRefunds, pendingDeposits, pendingFinals] =
    await Promise.all([
      prisma.payment.aggregate({
        where: { status: "paid" },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { status: "paid", paidAt: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      // Still paid, but part of the money went back: a handful of rows at most
      prisma.payment.findMany({
        where: { status: "paid", refundedAmount: { gt: 0 } },
        select: { status: true, amount: true, taxAmount: true, refundedAmount: true, paidAt: true },
      }),
      prisma.payment.aggregate({
        where: { kind: "deposit", status: "pending" },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.payment.aggregate({
        where: {
          kind: "final",
          status: "pending",
          project: { status: "ready_for_payment" },
        },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

  const refundedTotal = partialRefunds.reduce((sum, p) => sum + netRefunded(p), 0);
  const refundedThisMonth = partialRefunds
    .filter((p) => p.paidAt && p.paidAt >= startOfMonth)
    .reduce((sum, p) => sum + netRefunded(p), 0);

  return {
    totalRevenue: (paid._sum.amount ?? 0) - refundedTotal,
    thisMonthRevenue: (paidThisMonth._sum.amount ?? 0) - refundedThisMonth,
    pendingPayments: pendingDeposits._count + pendingFinals._count,
    pendingAmount:
      (pendingDeposits._sum.amount ?? 0) + (pendingFinals._sum.amount ?? 0),
  };
}
