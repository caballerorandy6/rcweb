"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";

/** All amounts in cents, like `Payment.amount`; format with `formatCurrency()` */
export interface RevenueStats {
  /** Every paid charge (deposits and final payments) */
  totalRevenue: number;
  /** Paid charges whose `paidAt` falls in the current calendar month */
  thisMonthRevenue: number;
  /** Charges still due: unpaid deposits plus final payments of projects marked ready */
  pendingPayments: number;
  pendingAmount: number;
}

/**
 * The one revenue figure for the admin: the sum of paid `Payment` rows.
 * The dashboard and the invoices page both read it, so they always agree.
 */
export async function getRevenueStatsAction(): Promise<RevenueStats> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    throw new Error(authCheck.error);
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [paid, paidThisMonth, pendingDeposits, pendingFinals] =
    await Promise.all([
      prisma.payment.aggregate({
        where: { status: "paid" },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { status: "paid", paidAt: { gte: startOfMonth } },
        _sum: { amount: true },
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

  return {
    totalRevenue: paid._sum.amount ?? 0,
    thisMonthRevenue: paidThisMonth._sum.amount ?? 0,
    pendingPayments: pendingDeposits._count + pendingFinals._count,
    pendingAmount:
      (pendingDeposits._sum.amount ?? 0) + (pendingFinals._sum.amount ?? 0),
  };
}
