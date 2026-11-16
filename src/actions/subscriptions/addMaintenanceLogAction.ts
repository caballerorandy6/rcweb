"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/authGuard";
import { prisma } from "@/lib/prisma";
import type { ActionResultSimple } from "@/types/common";

const InputSchema = z.object({
  subscriptionId: z.uuid(),
  workedOn: z.iso.date(),
  // A single entry longer than a working day is a typo
  minutes: z.number().int().min(1).max(600),
  description: z.string().trim().min(1).max(1000),
});

/** Logs a piece of work done under a maintenance plan */
export async function addMaintenanceLogAction(
  input: z.input<typeof InputSchema>
): Promise<ActionResultSimple> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return { success: false, error: authCheck.error };
  }

  const parsed = InputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Check the date, the minutes (1–600) and the description" };
  }

  const { subscriptionId, workedOn, minutes, description } = parsed.data;
  try {
    await prisma.maintenanceLog.create({
      data: {
        subscriptionId,
        // @db.Date column: midnight UTC keeps the calendar day as typed
        workedOn: new Date(`${workedOn}T00:00:00.000Z`),
        minutes,
        description,
      },
    });
    revalidatePath(`/subscriptions/${subscriptionId}`);
    return { success: true };
  } catch (error) {
    console.error("Error adding a maintenance log entry:", error);
    return { success: false, error: "Failed to save the entry" };
  }
}
