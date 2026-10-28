"use server";

import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import type { ActionResultSimple } from "@/types/common";

const inputSchema = z.object({
  id: z.string().min(1).max(200),
  hidden: z.boolean(),
});

/**
 * Oculta o vuelve a mostrar una reseña en la web. La decisión sobrevive a las
 * sincronizaciones (el sync no toca `hidden`) y la home se regenera al momento.
 */
export async function setGoogleReviewHiddenAction(
  id: string,
  hidden: boolean
): Promise<ActionResultSimple> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return { success: false, error: authCheck.error };
  }

  const parsed = inputSchema.safeParse({ id, hidden });
  if (!parsed.success) {
    return { success: false, error: "Invalid review." };
  }

  try {
    const { count } = await prisma.googleReview.updateMany({
      where: { id: parsed.data.id },
      data: { hidden: parsed.data.hidden },
    });
    if (count === 0) {
      return { success: false, error: "Review not found. Sync again and retry." };
    }
  } catch (error) {
    Sentry.captureException(error, { tags: { feature: "google-reviews" } });
    console.error("Failed to update review visibility:", error);
    return { success: false, error: "Could not update the review." };
  }

  revalidatePath("/");
  return { success: true };
}
