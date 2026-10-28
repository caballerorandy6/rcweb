import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { listGoogleReviews } from "@/lib/googleReviews/api";
import { getGoogleReviewsConfig } from "@/lib/googleReviews/config";

export interface GoogleReviewsSyncResult {
  totalReviewCount: number;
  averageRating: number;
  stored: number;
  removed: number;
}

export type GoogleReviewsSyncOutcome =
  | { ok: true; result: GoogleReviewsSyncResult }
  | { ok: false; error: "not_configured" | "api_error"; message: string };

/**
 * Copia las reseñas del perfil a GoogleReview y la nota/total a
 * GoogleReviewSummary, borra las que Google ya no devuelve y regenera la
 * home. Idempotente; conserva el `hidden` que haya puesto el admin.
 */
export async function syncGoogleReviews(): Promise<GoogleReviewsSyncOutcome> {
  const config = getGoogleReviewsConfig();
  if (!config) {
    return {
      ok: false,
      error: "not_configured",
      message: "Google reviews are not configured (GOOGLE_OAUTH_* / GBP_* variables missing).",
    };
  }

  try {
    const listing = await listGoogleReviews(config);
    const ids = listing.reviews.map((review) => review.id);

    const { count: removed } = await prisma.$transaction(async (tx) => {
      for (const { id, ...data } of listing.reviews) {
        // `hidden` no va en `update`: la decisión del admin sobrevive a cada sync.
        await tx.googleReview.upsert({ where: { id }, create: { id, ...data }, update: data });
      }
      const summary = {
        averageRating: listing.averageRating,
        totalReviewCount: listing.totalReviewCount,
      };
      await tx.googleReviewSummary.upsert({
        where: { id: 1 },
        create: { id: 1, ...summary },
        update: summary,
      });
      return tx.googleReview.deleteMany({ where: { id: { notIn: ids } } });
    });

    // La home es estática: se regenera aquí, no cada 7 días por reloj.
    revalidatePath("/");

    return {
      ok: true,
      result: {
        totalReviewCount: listing.totalReviewCount,
        averageRating: listing.averageRating,
        stored: listing.reviews.length,
        removed,
      },
    };
  } catch (error) {
    Sentry.captureException(error, { tags: { feature: "google-reviews" } });
    console.error("Google reviews sync failed:", error);
    return {
      ok: false,
      error: "api_error",
      message: error instanceof Error ? error.message : "Google reviews sync failed",
    };
  }
}
