"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import { LEAD_STATUSES } from "@/lib/leadStatus";
import { normalizeLeadSource } from "@/lib/leadSources";
import type { LeadStatus } from "@/generated/prisma/enums";

export interface LeadSourceStat {
  source: string;
  count: number;
  percentage: number;
}

export interface LeadsBySourceResult {
  sources: LeadSourceStat[];
  total: number;
  byStatus: Record<LeadStatus, number>;
}

/** Contacts grouped by where they came from, plus the pipeline totals */
export async function getLeadsBySourceAction(): Promise<LeadsBySourceResult> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    throw new Error(authCheck.error);
  }

  const [sourceGroups, total, statusGroups] = await Promise.all([
    prisma.contact.groupBy({ by: ["source"], _count: { id: true } }),
    prisma.contact.count(),
    prisma.contact.groupBy({ by: ["leadStatus"], _count: { id: true } }),
  ]);

  // Old rows stored some sources in uppercase ("SMS_OPT_IN"): count them together
  const counts = new Map<string, number>();
  for (const group of sourceGroups) {
    const key = normalizeLeadSource(group.source);
    counts.set(key, (counts.get(key) ?? 0) + group._count.id);
  }

  const sources: LeadSourceStat[] = Array.from(counts, ([source, count]) => ({
    source,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0,
  })).sort((a, b) => b.count - a.count);

  const byStatus = Object.fromEntries(LEAD_STATUSES.map((status) => [status, 0])) as Record<
    LeadStatus,
    number
  >;
  for (const group of statusGroups) {
    byStatus[group.leadStatus] = group._count.id;
  }

  return { sources, total, byStatus };
}
