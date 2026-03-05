"use server";

import { prisma } from "@/lib/prisma";

export interface UTMSourceStats {
  utmSource: string;
  count: number;
  percentage: number;
}

export interface UTMCampaignStats {
  utmCampaign: string;
  utmSource: string | null;
  count: number;
}

export interface LeadsByUTMResult {
  bySources: UTMSourceStats[];
  byCampaigns: UTMCampaignStats[];
  totalWithUTM: number;
  totalWithoutUTM: number;
}

export async function getLeadsByUTMAction(): Promise<LeadsByUTMResult> {
  // Get counts by UTM source
  const sourceGroups = await prisma.contact.groupBy({
    by: ["utmSource"],
    _count: { id: true },
    where: {
      utmSource: { not: null },
    },
    orderBy: {
      _count: { id: "desc" },
    },
  });

  // Get counts by campaign
  const campaignGroups = await prisma.contact.groupBy({
    by: ["utmCampaign", "utmSource"],
    _count: { id: true },
    where: {
      utmCampaign: { not: null },
    },
    orderBy: {
      _count: { id: "desc" },
    },
    take: 10,
  });

  // Count with and without UTM
  const [withUTM, withoutUTM] = await Promise.all([
    prisma.contact.count({
      where: {
        OR: [
          { utmSource: { not: null } },
          { utmMedium: { not: null } },
          { utmCampaign: { not: null } },
        ],
      },
    }),
    prisma.contact.count({
      where: {
        AND: [
          { utmSource: null },
          { utmMedium: null },
          { utmCampaign: null },
        ],
      },
    }),
  ]);

  const totalWithUTM = sourceGroups.reduce((acc, g) => acc + g._count.id, 0);

  const bySources: UTMSourceStats[] = sourceGroups.map((group) => ({
    utmSource: group.utmSource || "Unknown",
    count: group._count.id,
    percentage: totalWithUTM > 0 ? Math.round((group._count.id / totalWithUTM) * 100) : 0,
  }));

  const byCampaigns: UTMCampaignStats[] = campaignGroups.map((group) => ({
    utmCampaign: group.utmCampaign || "Unknown",
    utmSource: group.utmSource,
    count: group._count.id,
  }));

  return {
    bySources,
    byCampaigns,
    totalWithUTM: withUTM,
    totalWithoutUTM: withoutUTM,
  };
}
