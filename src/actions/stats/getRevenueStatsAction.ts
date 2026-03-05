"use server";

import { prisma } from "@/lib/prisma";

export interface RevenueStats {
  totalRevenue: number; // In dollars
  thisMonthRevenue: number;
  pendingPayments: number; // Count of unpaid invoices
  pendingAmount: number; // Total pending in dollars
}

export async function getRevenueStatsAction(): Promise<RevenueStats> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [paidPayments, thisMonthPayments, pendingFirst, pendingSecond] =
    await Promise.all([
      // Total revenue from all paid payments
      prisma.payment.findMany({
        where: {
          OR: [{ firstPaid: true }, { secondPaid: true }],
        },
        select: {
          firstPayment: true,
          secondPayment: true,
          firstPaid: true,
          secondPaid: true,
        },
      }),
      // This month's paid payments
      prisma.payment.findMany({
        where: {
          OR: [
            { firstPaidAt: { gte: startOfMonth } },
            { secondPaidAt: { gte: startOfMonth } },
          ],
        },
        select: {
          firstPayment: true,
          secondPayment: true,
          firstPaid: true,
          secondPaid: true,
          firstPaidAt: true,
          secondPaidAt: true,
        },
      }),
      // Pending first payments (not paid yet)
      prisma.payment.findMany({
        where: { firstPaid: false },
        select: { firstPayment: true },
      }),
      // Pending second payments (first paid but second not)
      prisma.payment.findMany({
        where: {
          firstPaid: true,
          secondPaid: false,
          projectStatus: "ready_for_payment",
        },
        select: { secondPayment: true },
      }),
    ]);

  // Calculate total revenue (in cents, then convert to dollars)
  const totalRevenueCents = paidPayments.reduce((sum, p) => {
    let amount = 0;
    if (p.firstPaid) amount += p.firstPayment;
    if (p.secondPaid) amount += p.secondPayment;
    return sum + amount;
  }, 0);

  // Calculate this month's revenue
  const thisMonthRevenueCents = thisMonthPayments.reduce((sum, p) => {
    let amount = 0;
    if (p.firstPaid && p.firstPaidAt && p.firstPaidAt >= startOfMonth) {
      amount += p.firstPayment;
    }
    if (p.secondPaid && p.secondPaidAt && p.secondPaidAt >= startOfMonth) {
      amount += p.secondPayment;
    }
    return sum + amount;
  }, 0);

  // Pending payments count
  const pendingPayments = pendingFirst.length + pendingSecond.length;

  // Pending amount in cents
  const pendingAmountCents =
    pendingFirst.reduce((sum, p) => sum + p.firstPayment, 0) +
    pendingSecond.reduce((sum, p) => sum + p.secondPayment, 0);

  return {
    totalRevenue: Math.round(totalRevenueCents / 100),
    thisMonthRevenue: Math.round(thisMonthRevenueCents / 100),
    pendingPayments,
    pendingAmount: Math.round(pendingAmountCents / 100),
  };
}
