"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";

export async function getTotalEmailsSentAction(): Promise<number> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    throw new Error(authCheck.error);
  }

  const result = await prisma.emailCampaign.aggregate({
    _sum: { emailsSent: true },
  });
  return result._sum?.emailsSent || 0;
}
