"use server";

import { prisma } from "@/lib/prisma";

export interface LeadSourceStat {
  source: string;
  count: number;
  percentage: number;
}

export interface LeadsBySourceResult {
  sources: LeadSourceStat[];
  total: number;
  byStatus: {
    NEW: number;
    CONTACTED: number;
    INTERESTED: number;
    PROPOSAL_SENT: number;
    WON: number;
    LOST: number;
  };
}

export async function getLeadsBySourceAction(): Promise<LeadsBySourceResult> {
  try {
    // Get all contacts grouped by source
    const sourceGroups = await prisma.contact.groupBy({
      by: ["source"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    // Get total count
    const total = await prisma.contact.count();

    // Get counts by lead status
    const statusGroups = await prisma.contact.groupBy({
      by: ["leadStatus"],
      _count: {
        id: true,
      },
    });

    // Build sources array with percentages
    const sources: LeadSourceStat[] = sourceGroups.map((group) => ({
      source: group.source || "unknown",
      count: group._count.id,
      percentage: total > 0 ? Math.round((group._count.id / total) * 100) : 0,
    }));

    // Build status counts
    const byStatus = {
      NEW: 0,
      CONTACTED: 0,
      INTERESTED: 0,
      PROPOSAL_SENT: 0,
      WON: 0,
      LOST: 0,
    };

    for (const group of statusGroups) {
      if (group.leadStatus in byStatus) {
        byStatus[group.leadStatus as keyof typeof byStatus] = group._count.id;
      }
    }

    return {
      sources,
      total,
      byStatus,
    };
  } catch (error) {
    console.error("Error getting leads by source:", error);
    return {
      sources: [],
      total: 0,
      byStatus: {
        NEW: 0,
        CONTACTED: 0,
        INTERESTED: 0,
        PROPOSAL_SENT: 0,
        WON: 0,
        LOST: 0,
      },
    };
  }
}

// Get leads by source for a specific time period
export async function getLeadsBySourceForPeriodAction(
  startDate: Date,
  endDate: Date
): Promise<LeadsBySourceResult> {
  try {
    const sourceGroups = await prisma.contact.groupBy({
      by: ["source"],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    const total = await prisma.contact.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const statusGroups = await prisma.contact.groupBy({
      by: ["leadStatus"],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        id: true,
      },
    });

    const sources: LeadSourceStat[] = sourceGroups.map((group) => ({
      source: group.source || "unknown",
      count: group._count.id,
      percentage: total > 0 ? Math.round((group._count.id / total) * 100) : 0,
    }));

    const byStatus = {
      NEW: 0,
      CONTACTED: 0,
      INTERESTED: 0,
      PROPOSAL_SENT: 0,
      WON: 0,
      LOST: 0,
    };

    for (const group of statusGroups) {
      if (group.leadStatus in byStatus) {
        byStatus[group.leadStatus as keyof typeof byStatus] = group._count.id;
      }
    }

    return {
      sources,
      total,
      byStatus,
    };
  } catch (error) {
    console.error("Error getting leads by source for period:", error);
    return {
      sources: [],
      total: 0,
      byStatus: {
        NEW: 0,
        CONTACTED: 0,
        INTERESTED: 0,
        PROPOSAL_SENT: 0,
        WON: 0,
        LOST: 0,
      },
    };
  }
}
