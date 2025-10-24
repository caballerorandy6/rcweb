"use server";

import { prisma } from "@/lib/prisma";

// Obtener estadísticas de contactos elegibles
export const getNumberOfEligibleContactsAction = async () => {
  try {
    // Total de contactos con consentimiento Y que tienen email
    const eligible = await prisma.contact.count({
      where: {
        marketingConsent: true,
        emails: {
          some: {}, // Al menos un email
        },
      },
    });

    // Total de contactos
    const total = await prisma.contact.count();

    const percentage = total > 0 ? Math.round((eligible / total) * 100) : 0;

    return {
      eligible,
      total,
      percentage,
    };
  } catch (error) {
    console.error("Error getting contact stats:", error);
    return {
      eligible: 0,
      total: 0,
      percentage: 0,
    };
  }
};

// Obtener estadísticas de emails elegibles
export const getNumberOfEligibleEmailsAction = async () => {
  try {
    // Emails de contactos con consentimiento
    const eligibleEmails = await prisma.contactEmail.count({
      where: {
        contact: {
          marketingConsent: true,
        },
      },
    });

    // Total de emails en el sistema
    const totalEmails = await prisma.contactEmail.count();

    const consentPercentage =
      totalEmails > 0 ? Math.round((eligibleEmails / totalEmails) * 100) : 0;

    return {
      eligibleEmails,
      totalEmails,
      consentPercentage,
    };
  } catch (error) {
    console.error("Error getting email stats:", error);
    return {
      eligibleEmails: 0,
      totalEmails: 0,
      consentPercentage: 0,
    };
  }
};
