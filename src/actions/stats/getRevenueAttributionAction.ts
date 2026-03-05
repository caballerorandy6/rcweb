"use server";

import { prisma } from "@/lib/prisma";

export interface RevenueBySource {
  source: string;
  revenue: number; // in cents
  count: number;
  percentage: number;
}

export interface RevenueByUTM {
  utmSource: string;
  revenue: number;
  count: number;
}

export interface RevenueAttributionResult {
  totalRevenue: number;
  totalPaidPayments: number;
  byLeadSource: RevenueBySource[];
  byUTMSource: RevenueByUTM[];
  unattributed: {
    revenue: number;
    count: number;
  };
}

export async function getRevenueAttributionAction(): Promise<RevenueAttributionResult> {
  // Get all paid payments with their linked contacts
  const payments = await prisma.payment.findMany({
    where: {
      OR: [{ firstPaid: true }, { secondPaid: true }],
    },
    select: {
      id: true,
      email: true,
      totalAmount: true,
      firstPaid: true,
      secondPaid: true,
      firstPayment: true,
      secondPayment: true,
      contactId: true,
      contact: {
        select: {
          source: true,
          utmSource: true,
          utmCampaign: true,
        },
      },
    },
  });

  // Calculate paid amount for each payment
  const paymentsWithRevenue = payments.map((p) => ({
    ...p,
    paidAmount: (p.firstPaid ? p.firstPayment : 0) + (p.secondPaid ? p.secondPayment : 0),
  }));

  const totalRevenue = paymentsWithRevenue.reduce((acc, p) => acc + p.paidAmount, 0);
  const totalPaidPayments = payments.length;

  // Group by lead source
  const bySourceMap = new Map<string, { revenue: number; count: number }>();
  const byUTMMap = new Map<string, { revenue: number; count: number }>();
  let unattributedRevenue = 0;
  let unattributedCount = 0;

  for (const payment of paymentsWithRevenue) {
    if (payment.contact) {
      // By lead source
      const source = payment.contact.source || "unknown";
      const existing = bySourceMap.get(source) || { revenue: 0, count: 0 };
      bySourceMap.set(source, {
        revenue: existing.revenue + payment.paidAmount,
        count: existing.count + 1,
      });

      // By UTM source
      if (payment.contact.utmSource) {
        const utmExisting = byUTMMap.get(payment.contact.utmSource) || { revenue: 0, count: 0 };
        byUTMMap.set(payment.contact.utmSource, {
          revenue: utmExisting.revenue + payment.paidAmount,
          count: utmExisting.count + 1,
        });
      }
    } else {
      unattributedRevenue += payment.paidAmount;
      unattributedCount++;
    }
  }

  // Convert to arrays and sort by revenue
  const byLeadSource: RevenueBySource[] = Array.from(bySourceMap.entries())
    .map(([source, data]) => ({
      source,
      revenue: data.revenue,
      count: data.count,
      percentage: totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 100) : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const byUTMSource: RevenueByUTM[] = Array.from(byUTMMap.entries())
    .map(([utmSource, data]) => ({
      utmSource,
      revenue: data.revenue,
      count: data.count,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return {
    totalRevenue,
    totalPaidPayments,
    byLeadSource,
    byUTMSource,
    unattributed: {
      revenue: unattributedRevenue,
      count: unattributedCount,
    },
  };
}

/**
 * Links a Payment to an existing Contact based on email.
 * Call this when creating a new Payment to enable revenue attribution.
 */
export async function linkPaymentToContact(paymentId: string): Promise<boolean> {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      select: { email: true, contactId: true },
    });

    if (!payment || payment.contactId) return false; // Already linked or not found

    // Find contact by email
    const contactEmail = await prisma.contactEmail.findUnique({
      where: { email: payment.email },
      select: { contactId: true },
    });

    if (!contactEmail) return false;

    // Link the payment to the contact
    await prisma.payment.update({
      where: { id: paymentId },
      data: { contactId: contactEmail.contactId },
    });

    // Update contact status to WON
    await prisma.contact.update({
      where: { id: contactEmail.contactId },
      data: { leadStatus: "WON" },
    });

    return true;
  } catch (error) {
    console.error("Error linking payment to contact:", error);
    return false;
  }
}
