"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";

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
  totalPaidProjects: number;
  byLeadSource: RevenueBySource[];
  byUTMSource: RevenueByUTM[];
  unattributed: {
    revenue: number;
    count: number;
  };
}

export async function getRevenueAttributionAction(): Promise<RevenueAttributionResult> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    throw new Error(authCheck.error);
  }

  // Projects with at least one paid charge, with their linked contact
  const projects = await prisma.project.findMany({
    where: { payments: { some: { status: "paid" } } },
    select: {
      id: true,
      payments: {
        where: { status: "paid" },
        select: { amount: true },
      },
      contact: {
        select: {
          source: true,
          utmSource: true,
          utmCampaign: true,
        },
      },
    },
  });

  // Paid amount per project
  const projectsWithRevenue = projects.map((p) => ({
    contact: p.contact,
    paidAmount: p.payments.reduce((sum, payment) => sum + payment.amount, 0),
  }));

  const totalRevenue = projectsWithRevenue.reduce((acc, p) => acc + p.paidAmount, 0);
  const totalPaidProjects = projects.length;

  // Group by lead source
  const bySourceMap = new Map<string, { revenue: number; count: number }>();
  const byUTMMap = new Map<string, { revenue: number; count: number }>();
  let unattributedRevenue = 0;
  let unattributedCount = 0;

  for (const project of projectsWithRevenue) {
    if (project.contact) {
      // By lead source
      const source = project.contact.source || "unknown";
      const existing = bySourceMap.get(source) || { revenue: 0, count: 0 };
      bySourceMap.set(source, {
        revenue: existing.revenue + project.paidAmount,
        count: existing.count + 1,
      });

      // By UTM source
      if (project.contact.utmSource) {
        const utmExisting = byUTMMap.get(project.contact.utmSource) || { revenue: 0, count: 0 };
        byUTMMap.set(project.contact.utmSource, {
          revenue: utmExisting.revenue + project.paidAmount,
          count: utmExisting.count + 1,
        });
      }
    } else {
      unattributedRevenue += project.paidAmount;
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
    totalPaidProjects,
    byLeadSource,
    byUTMSource,
    unattributed: {
      revenue: unattributedRevenue,
      count: unattributedCount,
    },
  };
}

/**
 * Links a Project to an existing Contact based on email.
 * Call this when creating a new Project to enable revenue attribution.
 */
export async function linkProjectToContact(projectId: string): Promise<boolean> {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { email: true, contactId: true },
    });

    if (!project || project.contactId) return false; // Already linked or not found

    // Find contact by email
    const contactEmail = await prisma.contactEmail.findUnique({
      where: { email: project.email },
      select: { contactId: true },
    });

    if (!contactEmail) return false;

    // Link the project to the contact
    await prisma.project.update({
      where: { id: projectId },
      data: { contactId: contactEmail.contactId },
    });

    // Update contact status to WON
    await prisma.contact.update({
      where: { id: contactEmail.contactId },
      data: { leadStatus: "WON" },
    });

    return true;
  } catch (error) {
    console.error("Error linking project to contact:", error);
    return false;
  }
}
