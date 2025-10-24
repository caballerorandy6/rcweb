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
    console.log("=== UPDATE CONTACT DEBUG ===");
    console.log("Contact ID:", id);
    console.log("Data to update:", JSON.stringify(data, null, 2));

    const contact = await prisma.contact.update({
      where: { id },
      data,
      include: {
        emails: true,
        phones: true,
      },
    });

    console.log("Updated contact:", JSON.stringify({
      id: contact.id,
      name: contact.name,
      marketingConsent: contact.marketingConsent
    }, null, 2));
    console.log("=== END DEBUG ===");

    return { success: true, contact };
  } catch (error) {
    console.error("Error updating contact:", error);
    return { success: false, error: "Failed to update contact" };
  }
}
