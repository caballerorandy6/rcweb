import { prisma } from "@/lib/prisma";

export const getTotalEmailsSentAction = async (): Promise<number> => {
  const result = await prisma.emailCampaign.aggregate({
    _sum: { emailsSent: true },
  });
  return result._sum?.emailsSent || 0;
};
