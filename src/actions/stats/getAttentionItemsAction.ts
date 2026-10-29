"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";

/** How many rows each group shows on the dashboard; the count is the real total */
const PREVIEW = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface AttentionItems {
  /** Contacts still in NEW: nobody has replied yet */
  newLeads: {
    count: number;
    items: { id: string; name: string; createdAt: Date }[];
  };
  /** Sent quotes the customer has not accepted, soonest deadline first (expired included) */
  openQuotes: {
    count: number;
    items: {
      id: string;
      quoteNumber: string;
      name: string;
      totalAmount: number;
      expiresAt: Date;
    }[];
  };
  /** Projects marked ready whose final 50 % is still unpaid */
  readyForPayment: {
    count: number;
    items: { id: string; name: string; planName: string; totalAmount: number }[];
  };
  /** Unfinished milestones past their due date */
  overdueMilestones: {
    count: number;
    items: {
      id: string;
      title: string;
      dueDate: Date;
      project: { id: string; name: string };
    }[];
  };
}

/**
 * What is waiting on the admin right now. Everything is derived from existing
 * rows (no flags to keep in sync): a lead is "new" until its status changes, a
 * quote is "open" while sent, a project waits while ready_for_payment, a
 * milestone is overdue while unfinished past its due date.
 */
export async function getAttentionItemsAction(): Promise<AttentionItems> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    throw new Error(authCheck.error);
  }

  const now = new Date();
  // Quotes that lapsed more than a month ago are stale, not actionable
  const quoteFloor = new Date(now.getTime() - 30 * DAY_MS);

  const newLeadsWhere = { leadStatus: "NEW" as const };
  const openQuotesWhere = {
    status: "sent" as const,
    expiresAt: { gte: quoteFloor },
  };
  const readyWhere = { status: "ready_for_payment" as const };
  const overdueWhere = {
    status: { not: "completed" as const },
    dueDate: { lt: now },
  };

  const [
    newLeads,
    newLeadsCount,
    openQuotes,
    openQuotesCount,
    ready,
    readyCount,
    overdue,
    overdueCount,
  ] = await Promise.all([
    prisma.contact.findMany({
      where: newLeadsWhere,
      orderBy: { createdAt: "desc" },
      take: PREVIEW,
      select: { id: true, name: true, createdAt: true },
    }),
    prisma.contact.count({ where: newLeadsWhere }),
    prisma.quote.findMany({
      where: openQuotesWhere,
      orderBy: { expiresAt: "asc" },
      take: PREVIEW,
      select: {
        id: true,
        quoteNumber: true,
        name: true,
        totalAmount: true,
        expiresAt: true,
      },
    }),
    prisma.quote.count({ where: openQuotesWhere }),
    prisma.project.findMany({
      where: readyWhere,
      orderBy: { updatedAt: "asc" },
      take: PREVIEW,
      select: { id: true, name: true, planName: true, totalAmount: true },
    }),
    prisma.project.count({ where: readyWhere }),
    prisma.milestone.findMany({
      where: overdueWhere,
      orderBy: { dueDate: "asc" },
      take: PREVIEW,
      select: {
        id: true,
        title: true,
        dueDate: true,
        project: { select: { id: true, name: true } },
      },
    }),
    prisma.milestone.count({ where: overdueWhere }),
  ]);

  return {
    newLeads: { count: newLeadsCount, items: newLeads },
    openQuotes: {
      count: openQuotesCount,
      // expiresAt is set whenever status is sent; the filter guarantees it
      items: openQuotes.flatMap((q) =>
        q.expiresAt ? [{ ...q, expiresAt: q.expiresAt }] : []
      ),
    },
    readyForPayment: { count: readyCount, items: ready },
    overdueMilestones: {
      count: overdueCount,
      items: overdue.flatMap((m) =>
        m.dueDate ? [{ ...m, dueDate: m.dueDate }] : []
      ),
    },
  };
}
