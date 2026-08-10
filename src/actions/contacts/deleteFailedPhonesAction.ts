"use server";

import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/types/common";
import { requireAdmin } from "@/lib/authGuard";

export async function deleteFailedPhonesAction(
  phoneNumbers: string[]
): Promise<ActionResult<{ deletedCount: number }>> {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.authorized) {
      return { success: false, error: authCheck.error };
    }

    if (phoneNumbers.length === 0) {
      return {
        success: false,
        error: "No phone numbers provided",
      };
    }

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

    // Eliminar teléfonos por ID
    const result = await prisma.contactPhone.deleteMany({
      where: {
        id: {
          in: phoneIdsToDelete,
        },
      },
    });

    return {
      success: true,
      data: {
        deletedCount: result.count,
      },
    };
  } catch (error) {
    console.error("Error deleting failed phones:", error);
    const errorObj = error as { message?: string };
    return {
      success: false,
      error: errorObj?.message || "Failed to delete phone numbers",
    };
  }
}
