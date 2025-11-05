"use server";

import { prisma } from "@/lib/prisma";

export async function deleteFailedPhonesAction(
  phoneNumbers: string[]
): Promise<{ success: boolean; message: string; deletedCount?: number }> {
  try {
    if (phoneNumbers.length === 0) {
      return {
        success: false,
        message: "No phone numbers provided",
      };
    }

    // Normalizar números (asegurar formato consistente)
    const normalizedNumbers = phoneNumbers.map((phone) => {
      // Remover espacios, guiones, paréntesis
      let cleaned = phone.replace(/[\s\-\(\)]/g, "");
      // Asegurar que tenga +
      if (!cleaned.startsWith("+")) {
        cleaned = `+${cleaned}`;
      }
      return cleaned;
    });

    // Eliminar teléfonos
    const result = await prisma.contactPhone.deleteMany({
      where: {
        phone: {
          in: normalizedNumbers,
        },
      },
    });

    return {
      success: true,
      message: `Deleted ${result.count} phone number(s)`,
      deletedCount: result.count,
    };
  } catch (error) {
    console.error("Error deleting failed phones:", error);
    const errorObj = error as { message?: string };
    return {
      success: false,
      message: errorObj?.message || "Failed to delete phone numbers",
    };
  }
}
