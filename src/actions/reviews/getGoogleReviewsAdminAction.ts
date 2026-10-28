"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import { getGoogleReviewsConfig, GOOGLE_REVIEWS_HOME_LIMIT } from "@/lib/googleReviews/config";
import { reviewDisplayText } from "@/lib/googleReviews/format";

export interface AdminGoogleReview {
  id: string;
  author: string;
  rating: number;
  /** Texto traducido; null si la reseña solo tiene estrellas */
  text: string | null;
  reply: string | null;
  /** ISO */
  createTime: string;
  hidden: boolean;
}

export interface GoogleReviewsAdminResult {
  configured: boolean;
  /** null mientras no haya corrido ninguna sincronización */
  summary: { averageRating: number; totalReviewCount: number; syncedAt: string } | null;
  /** Cuántas reseñas con texto enseña la home ahora mismo */
  shownOnSite: number;
  reviews: AdminGoogleReview[];
}

/** Tarjeta «Google reviews» del dashboard: resumen y todas las reseñas guardadas, ocultas incluidas. */
export async function getGoogleReviewsAdminAction(): Promise<GoogleReviewsAdminResult> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    throw new Error(authCheck.error);
  }

  const [summary, reviews] = await Promise.all([
    prisma.googleReviewSummary.findUnique({ where: { id: 1 } }),
    prisma.googleReview.findMany({
      orderBy: { createTime: "desc" },
      select: {
        id: true,
        reviewerName: true,
        rating: true,
        comment: true,
        replyComment: true,
        createTime: true,
        hidden: true,
      },
    }),
  ]);

  let visibleWithText = 0;
  const items: AdminGoogleReview[] = reviews.map((review) => {
    if (!review.hidden && review.comment) visibleWithText++;
    return {
      id: review.id,
      author: review.reviewerName,
      rating: review.rating,
      text: review.comment ? reviewDisplayText(review.comment) : null,
      reply: review.replyComment ? reviewDisplayText(review.replyComment) : null,
      createTime: review.createTime.toISOString(),
      hidden: review.hidden,
    };
  });

  return {
    configured: getGoogleReviewsConfig() !== null,
    summary: summary
      ? {
          averageRating: summary.averageRating,
          totalReviewCount: summary.totalReviewCount,
          syncedAt: summary.syncedAt.toISOString(),
        }
      : null,
    shownOnSite: Math.min(visibleWithText, GOOGLE_REVIEWS_HOME_LIMIT),
    reviews: items,
  };
}
