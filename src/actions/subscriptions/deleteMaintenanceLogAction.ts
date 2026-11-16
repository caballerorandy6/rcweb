"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/authGuard";
import { prisma } from "@/lib/prisma";
import type { ActionResultSimple } from "@/types/common";

const InputSchema = z.object({ id: z.uuid() });

/** Removes a work log entry typed by mistake */
export async function deleteMaintenanceLogAction(input: {
  id: string;
}): Promise<ActionResultSimple> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return { success: false, error: authCheck.error };
  }

  const parsed = InputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid entry" };
  }

  try {
    const deleted = await prisma.maintenanceLog.delete({
      where: { id: parsed.data.id },
      select: { subscriptionId: true },
    });
    revalidatePath(`/subscriptions/${deleted.subscriptionId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting a maintenance log entry:", error);
    return { success: false, error: "Failed to delete the entry" };
  }
}
