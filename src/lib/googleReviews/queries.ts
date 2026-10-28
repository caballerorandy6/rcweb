import { cache } from "react";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import { GOOGLE_REVIEWS_HOME_LIMIT } from "@/lib/googleReviews/config";
import { reviewDisplayText } from "@/lib/googleReviews/format";

export interface PublicGoogleReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  createTime: Date;
}

export interface PublicGoogleReviews {
  averageRating: number;
  totalReviewCount: number;
  syncedAt: Date;
  reviews: PublicGoogleReview[];
}

/**
 * Lo que enseña la web: nota y total del perfil más las últimas reseñas con
 * texto que el admin no haya ocultado. `null` mientras no haya sincronización
 * o si la base falla (la home enseña entonces los testimonios fijos y nunca
 * se cae por las reseñas). `cache()` evita la doble consulta cuando la
 * sección y el JSON-LD la piden en el mismo render.
 */
export const getPublicGoogleReviews = cache(async (): Promise<PublicGoogleReviews | null> => {
  try {
    const [summary, reviews] = await Promise.all([
      prisma.googleReviewSummary.findUnique({ where: { id: 1 } }),
      prisma.googleReview.findMany({
        where: { hidden: false, comment: { not: null } },
        orderBy: { createTime: "desc" },
        take: GOOGLE_REVIEWS_HOME_LIMIT,
        select: { id: true, reviewerName: true, rating: true, comment: true, createTime: true },
      }),
    ]);
    if (!summary || summary.totalReviewCount === 0) return null;

    return {
      averageRating: summary.averageRating,
      totalReviewCount: summary.totalReviewCount,
      syncedAt: summary.syncedAt,
      reviews: reviews.map((review) => ({
        id: review.id,
        author: review.reviewerName,
        rating: review.rating,
        text: reviewDisplayText(review.comment ?? ""),
        createTime: review.createTime,
      })),
    };
  } catch (error) {
    Sentry.captureException(error, { tags: { feature: "google-reviews" } });
    console.error("Google reviews query failed:", error);
    return null;
  }
});
