"use server";

import { prisma } from "@/lib/prisma";

// Función helper para obtener estadísticas de SMS
export const getSmsStatsAction = async () => {
  try {
    // Contar teléfonos con consentimiento de marketing
    const phonesWithConsent = await prisma.contactPhone.count({
      where: {
        contact: {
          marketingConsent: true,
        },
      },
    });

    // Total de teléfonos en la base de datos
    const totalPhones = await prisma.contactPhone.count();

    // Total de contactos
    const totalContacts = await prisma.contact.count();

    const costPerSms = 0.0079; // Costo por SMS en USA con Twilio
    const estimatedCost = phonesWithConsent * costPerSms;

    return {
      eligibleContacts: phonesWithConsent, // Número de teléfonos con consentimiento
      totalContacts,
      totalPhones,
      estimatedCost,
      consentPercentage:
        totalPhones > 0
          ? Math.round((phonesWithConsent / totalPhones) * 100)
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
