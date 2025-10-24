"use server";

import { prisma } from "@/lib/prisma";

// Función helper para obtener estadísticas de SMS
export const getSmsStatsAction = async () => {
  try {
    const eligibleContacts = await prisma.contact.count({
      where: {
        marketingConsent: true,
        phones: {
          some: {},
        },
      },
    });

    const totalContacts = await prisma.contact.count();
    const totalPhones = await prisma.contactPhone.count();

    const costPerSms = 0.0079; // Costo por SMS en USA con Twilio
    const estimatedCost = eligibleContacts * costPerSms;

    return {
      eligibleContacts,
      totalContacts,
      totalPhones,
      estimatedCost,
      consentPercentage:
        totalContacts > 0
          ? Math.round((eligibleContacts / totalContacts) * 100)
          : 0,
    };
  } catch (error) {
    console.error("Error getting SMS stats:", error);
    return {
      eligibleContacts: 0,
      totalContacts: 0,
      totalPhones: 0,
      estimatedCost: 0,
      consentPercentage: 0,
    };
  }
};
