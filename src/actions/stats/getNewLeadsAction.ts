"use server";

import { prisma } from "@/lib/prisma";

export interface NewLeadsStats {
  thisWeek: number;
  lastWeek: number;
  trend: "up" | "down" | "same";
  percentChange: number;
}

export async function getNewLeadsAction(): Promise<NewLeadsStats> {
  const now = new Date();

  // Start of this week (Sunday)
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - now.getDay());
  startOfThisWeek.setHours(0, 0, 0, 0);

  // Start of last week
  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

  const [thisWeek, lastWeek] = await Promise.all([
    prisma.contact.count({
      where: {
        createdAt: { gte: startOfThisWeek },
      },
    }),
    prisma.contact.count({
      where: {
        createdAt: {
          gte: startOfLastWeek,
          lt: startOfThisWeek,
        },
      },
    }),
  ]);

  let trend: "up" | "down" | "same" = "same";
  let percentChange = 0;

  if (lastWeek > 0) {
    percentChange = Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
    if (thisWeek > lastWeek) trend = "up";
    else if (thisWeek < lastWeek) trend = "down";
  } else if (thisWeek > 0) {
    trend = "up";
    percentChange = 100;
  }

  return {
    thisWeek,
    lastWeek,
    trend,
    percentChange,
  };
}
