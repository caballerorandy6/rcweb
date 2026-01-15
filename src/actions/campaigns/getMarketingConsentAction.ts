"use server";

import { prisma } from "@/lib/prisma";

export async function getMarketingConsentAction() {
  const totalMarketingConsent = await prisma.contact.count({
    where: { marketingConsent: true },
  });
  return totalMarketingConsent;
}
