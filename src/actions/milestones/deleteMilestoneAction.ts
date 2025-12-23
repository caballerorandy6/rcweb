"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";

type DeleteMilestoneResult =
  | { success: true }
  | { success: false; message: string };

export async function deleteMilestoneAction(
  id: string
): Promise<DeleteMilestoneResult> {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return { success: false, message: auth.error || "Unauthorized" };
  }

  try {
    await prisma.milestone.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Error deleting milestone:", error);
    return { success: false, message: "Failed to delete milestone" };
  }
}
