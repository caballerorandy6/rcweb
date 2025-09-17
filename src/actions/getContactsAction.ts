"use server";

import { prisma } from "@/lib/prisma";

// Obtener todos los contactos con relaciones
export async function getContactsAction() {
  try {
    const contacts = await prisma.contact.findMany({
      include: {
        emails: true,
        phones: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, contacts };
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return { success: false, error: "Failed to fetch contacts" };
  }
}
