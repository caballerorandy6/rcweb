"use server";

import { prisma } from "@/lib/prisma";

export const getMarketingConsentAction = async () => {
  const totalMarketingConcent = await prisma.contact.count({
    where: { marketingConsent: true },
  });
  return totalMarketingConcent;
};
