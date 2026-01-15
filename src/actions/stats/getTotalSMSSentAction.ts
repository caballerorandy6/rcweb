"use server";

import { prisma } from "@/lib/prisma";

export async function getTotalSMSsentAction(): Promise<number> {
  const result = await prisma.smsCampaign.aggregate({
    _sum: { smsSent: true },
  });
  return result._sum?.smsSent || 0;
}
