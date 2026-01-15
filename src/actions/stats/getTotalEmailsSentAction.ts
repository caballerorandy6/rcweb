import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getTotalEmailsSentAction = cache(async (): Promise<number> => {
  const result = await prisma.emailCampaign.aggregate({
    _sum: { emailsSent: true },
  });
  return result._sum?.emailsSent || 0;
});
