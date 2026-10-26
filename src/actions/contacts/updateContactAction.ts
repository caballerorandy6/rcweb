"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { ActionResultSimple } from "@/types/common";
import { requireAdmin } from "@/lib/authGuard";
import { LeadStatus } from "@/generated/prisma/enums";

const UpdateContactSchema = z
  .object({
    name: z.string().trim().min(2, "Name is too short").max(100, "Name is too long"),
    marketingConsent: z.boolean(),
    leadStatus: z.enum(LeadStatus),
  })
  .partial();

export type UpdateContactInput = z.infer<typeof UpdateContactSchema>;

/** Edit a contact's name, marketing consent or pipeline status from the admin list */
export async function updateContactAction(
  id: string,
  input: UpdateContactInput
): Promise<ActionResultSimple> {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.authorized) {
      return { success: false, error: authCheck.error };
    }

    const parsed = UpdateContactSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: z.prettifyError(parsed.error) };
    }
    if (!z.uuid().safeParse(id).success) {
      return { success: false, error: "Invalid contact" };
    }

    await prisma.contact.update({ where: { id }, data: parsed.data });

    return { success: true };
  } catch (error) {
    console.error("Error updating contact:", error);
    return { success: false, error: "Failed to update contact" };
  }
}
