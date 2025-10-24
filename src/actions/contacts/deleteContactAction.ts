"use server";

import { prisma } from "@/lib/prisma";

export async function deleteContactAction(id: string) {
  try {
    await prisma.contact.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting contact:", error);
    return { success: false, error: "Failed to delete contact" };
  }
}
