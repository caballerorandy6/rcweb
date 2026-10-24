"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";

export interface RevenueStats {
  totalRevenue: number; // In dollars
  thisMonthRevenue: number;
  pendingPayments: number; // Count of charges still due
  pendingAmount: number; // Total pending in dollars
}

export async function getRevenueStatsAction(): Promise<RevenueStats> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    throw new Error(authCheck.error);
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [paid, paidThisMonth, pendingDeposits, pendingFinals] =
    await Promise.all([
      // Total revenue from all paid charges
      prisma.payment.aggregate({
        where: { status: "paid" },
        _sum: { amount: true },
      }),
      // This month's paid charges
      prisma.payment.aggregate({
        where: { status: "paid", paidAt: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      // Deposits not paid yet
      prisma.payment.aggregate({
        where: { kind: "deposit", status: "pending" },
        _sum: { amount: true },
        _count: true,
      }),
      // Final payments due (project ready, final not paid)
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

  const totalRevenueCents = paid._sum.amount ?? 0;
  const thisMonthRevenueCents = paidThisMonth._sum.amount ?? 0;
  const pendingPayments = pendingDeposits._count + pendingFinals._count;
  const pendingAmountCents =
    (pendingDeposits._sum.amount ?? 0) + (pendingFinals._sum.amount ?? 0);

  return {
    totalRevenue: Math.round(totalRevenueCents / 100),
    thisMonthRevenue: Math.round(thisMonthRevenueCents / 100),
    pendingPayments,
    pendingAmount: Math.round(pendingAmountCents / 100),
  };
}
