"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/authGuard";
import { prisma } from "@/lib/prisma";
import type { ActionResultSimple } from "@/types/common";

const InputSchema = z.object({
  projectId: z.uuid(),
  locale: z.enum(["en", "es"]),
});

/** Language of the customer's future emails and invoices. Sent documents stay as they are. */
export async function updateProjectLocaleAction(input: {
  projectId: string;
  locale: string;
}): Promise<ActionResultSimple> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return { success: false, error: authCheck.error };
  }

  const parsed = InputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid language" };
  }

  try {
    await prisma.project.update({
      where: { id: parsed.data.projectId },
      data: { locale: parsed.data.locale },
    });
    revalidatePath(`/projects/${parsed.data.projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating the project language:", error);
    return { success: false, error: "Failed to update the language" };
  }
}
