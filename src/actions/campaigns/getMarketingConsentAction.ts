import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getMarketingConsentAction = cache(async () => {
  const totalMarketingConsent = await prisma.contact.count({
    where: { marketingConsent: true },
  });
  return totalMarketingConsent;
});
