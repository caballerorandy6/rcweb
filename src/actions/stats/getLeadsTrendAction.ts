"use server";

import { prisma } from "@/lib/prisma";

export interface LeadTrendPoint {
  date: string;
  label: string;
  leads: number;
  conversions: number;
}

export interface LeadsTrendResult {
  data: LeadTrendPoint[];
  totalLeads: number;
  totalConversions: number;
  conversionRate: number;
  period: "7d" | "30d" | "90d";
}

export async function getLeadsTrendAction(
  period: "7d" | "30d" | "90d" = "30d"
): Promise<LeadsTrendResult> {
  const now = new Date();
  let startDate: Date;
  let groupBy: "day" | "week";

  switch (period) {
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      groupBy = "day";
      break;
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      groupBy = "day";
      break;
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      groupBy = "week";
      break;
  }

  // Get all contacts in the period
  const contacts = await prisma.contact.findMany({
    where: {
      createdAt: { gte: startDate },
    },
    select: {
      createdAt: true,
      leadStatus: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // Group by date
  const grouped = new Map<string, { leads: number; conversions: number }>();

  // Initialize all dates in range
  const current = new Date(startDate);
  while (current <= now) {
    const key = formatDateKey(current, groupBy);
    grouped.set(key, { leads: 0, conversions: 0 });

    if (groupBy === "day") {
      current.setDate(current.getDate() + 1);
    } else {
      current.setDate(current.getDate() + 7);
    }
  }

  // Count leads and conversions
  let totalLeads = 0;
  let totalConversions = 0;

  for (const contact of contacts) {
    const key = formatDateKey(contact.createdAt, groupBy);
    const entry = grouped.get(key);

    if (entry) {
      entry.leads++;
      totalLeads++;

      if (contact.leadStatus === "WON") {
        entry.conversions++;
        totalConversions++;
      }
    }
  }

  // Convert to array
  const data: LeadTrendPoint[] = Array.from(grouped.entries()).map(
    ([date, stats]) => ({
      date,
      label: formatLabel(date, groupBy),
      leads: stats.leads,
      conversions: stats.conversions,
    })
  );

  const conversionRate =
    totalLeads > 0 ? Math.round((totalConversions / totalLeads) * 100) : 0;

  return {
    data,
    totalLeads,
    totalConversions,
    conversionRate,
    period,
  };
}

function formatDateKey(date: Date, groupBy: "day" | "week"): string {
  if (groupBy === "day") {
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  } else {
    // Get start of week (Sunday)
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    return startOfWeek.toISOString().split("T")[0];
  }
}

function formatLabel(dateKey: string, groupBy: "day" | "week"): string {
  const date = new Date(dateKey);

  if (groupBy === "day") {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } else {
    const endOfWeek = new Date(date);
    endOfWeek.setDate(date.getDate() + 6);
    return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { day: "numeric" })}`;
  }
}
