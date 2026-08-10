"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";

export async function getTotalSMSsentAction(): Promise<number> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    throw new Error(authCheck.error);
  }

  const result = await prisma.smsCampaign.aggregate({
    _sum: { smsSent: true },
  });
  return result._sum?.smsSent || 0;
}
