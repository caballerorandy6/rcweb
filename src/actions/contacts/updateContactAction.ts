"use server";

import { prisma } from "@/lib/prisma";

export async function updateContactAction(
  id: string,
  data: {
    name?: string;
    marketingConsent?: boolean;
  }
) {
  try {
    const contact = await prisma.contact.update({
      where: { id },
      data,
      include: {
        emails: true,
        phones: true,
      },
    });

    return { success: true, contact };
  } catch (error) {
    console.error("Error updating contact:", error);
    return { success: false, error: "Failed to update contact" };
  }
}
