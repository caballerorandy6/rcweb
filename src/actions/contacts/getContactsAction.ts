"use server";

import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/types/common";

type ContactWithRelations = {
  id: string;
  name: string;
  marketingConsent: boolean;
  createdAt: Date;
  updatedAt: Date;
  emails: { id: string; email: string }[];
  phones: { id: string; phone: string }[];
};

// Obtener todos los contactos con relaciones
export async function getContactsAction(): Promise<
  ActionResult<{ contacts: ContactWithRelations[] }>
> {
  try {
    const contacts = await prisma.contact.findMany({
      include: {
        emails: true,
        phones: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: { contacts } };
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return { success: false, error: "Failed to fetch contacts" };
  }
}
