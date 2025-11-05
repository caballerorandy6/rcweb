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

    console.log("📥 Received phones to delete:", phoneNumbers);

    // Función para normalizar números (quitar espacios, guiones, paréntesis)
    const normalize = (phone: string) => {
      let cleaned = phone.replace(/[\s\-\(\)]/g, "");
      if (!cleaned.startsWith("+")) {
        cleaned = `+${cleaned}`;
      }
      return cleaned;
    };

    // Normalizar números recibidos
    const normalizedNumbers = phoneNumbers.map(normalize);
    console.log("🔍 Normalized phones from Twilio:", normalizedNumbers);

    // Obtener TODOS los teléfonos de la BD y buscar coincidencias normalizadas
    const allPhones = await prisma.contactPhone.findMany({
      select: {
        id: true,
        phone: true,
      },
    });

    // Encontrar IDs de teléfonos que coinciden después de normalizar
    const phoneIdsToDelete = allPhones
      .filter((dbPhone) => {
        const normalizedDbPhone = normalize(dbPhone.phone);
        return normalizedNumbers.includes(normalizedDbPhone);
      })
      .map((p) => p.id);

    console.log("📱 Found matching phone IDs:", phoneIdsToDelete);

    // Eliminar teléfonos por ID
    const result = await prisma.contactPhone.deleteMany({
      where: {
        id: {
          in: phoneIdsToDelete,
        },
      },
    });

    console.log("✅ Deleted count:", result.count);

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
