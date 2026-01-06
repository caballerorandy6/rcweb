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

export async function updateContactAction(
  id: string,
  data: {
    name?: string;
    marketingConsent?: boolean;
  }
): Promise<ActionResult<{ contact: ContactWithRelations }>> {
  try {
    const contact = await prisma.contact.update({
      where: { id },
      data,
      include: {
        emails: true,
        phones: true,
      },
    });

    return { success: true, data: { contact } };
  } catch (error) {
    console.error("Error updating contact:", error);
    return { success: false, error: "Failed to update contact" };
  }
}
