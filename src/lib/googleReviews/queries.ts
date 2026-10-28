import { prisma } from "@/lib/prisma";
import { GOOGLE_REVIEWS_HOME_LIMIT } from "@/lib/googleReviews/config";
import { reviewDisplayText } from "@/lib/googleReviews/format";

export interface PublicGoogleReview {
  id: string;
  author: string;
  photoUrl: string | null;
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
 * (la home enseña entonces los testimonios fijos).
 */
export async function getPublicGoogleReviews(): Promise<PublicGoogleReviews | null> {
  const [summary, reviews] = await Promise.all([
    prisma.googleReviewSummary.findUnique({ where: { id: 1 } }),
    prisma.googleReview.findMany({
      where: { hidden: false, comment: { not: null } },
      orderBy: { createTime: "desc" },
      take: GOOGLE_REVIEWS_HOME_LIMIT,
      select: {
        id: true,
        reviewerName: true,
        reviewerPhotoUrl: true,
        rating: true,
        comment: true,
        createTime: true,
      },
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
      photoUrl: review.reviewerPhotoUrl,
      rating: review.rating,
      text: reviewDisplayText(review.comment ?? ""),
      createTime: review.createTime,
    })),
  };
}
