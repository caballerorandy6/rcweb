import { z } from "zod";
import { getGoogleReviewsAccessToken } from "@/lib/googleReviews/auth";
import { GOOGLE_REVIEWS_PAGE_SIZE, type GoogleReviewsConfig } from "@/lib/googleReviews/config";
import { GoogleReviewsApiError } from "@/lib/googleReviews/errors";

const STAR_RATING: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

const reviewSchema = z.object({
  reviewId: z.string().min(1),
  reviewer: z
    .object({
      displayName: z.string().optional(),
      profilePhotoUrl: z.string().optional(),
      isAnonymous: z.boolean().optional(),
    })
    .optional(),
  starRating: z.string(),
  comment: z.string().optional(),
  createTime: z.string(),
  updateTime: z.string(),
  reviewReply: z
    .object({
      comment: z.string(),
      updateTime: z.string(),
    })
    .optional(),
});

const responseSchema = z.object({
  reviews: z.array(reviewSchema).default([]),
  averageRating: z.number().optional(),
  totalReviewCount: z.number().int().optional(),
  nextPageToken: z.string().optional(),
});

/** Una reseña tal como se guarda en GoogleReview (sin `hidden` ni `syncedAt`). */
export interface GoogleReviewRecord {
  id: string;
  reviewerName: string;
  reviewerPhotoUrl: string | null;
  isAnonymous: boolean;
  rating: number;
  comment: string | null;
  replyComment: string | null;
  replyTime: Date | null;
  createTime: Date;
  updateTime: Date;
}

export interface GoogleReviewsListing {
  reviews: GoogleReviewRecord[];
  averageRating: number;
  totalReviewCount: number;
}

/** Nombre que muestra Google cuando el autor no tiene perfil público. */
const ANONYMOUS_NAME = "A Google user";

function toRecord(review: z.infer<typeof reviewSchema>): GoogleReviewRecord | null {
  const rating = STAR_RATING[review.starRating];
  if (!rating) return null; // STAR_RATING_UNSPECIFIED: no se puede mostrar
  return {
    id: review.reviewId,
    reviewerName: review.reviewer?.displayName?.trim() || ANONYMOUS_NAME,
    reviewerPhotoUrl: review.reviewer?.profilePhotoUrl ?? null,
    isAnonymous: review.reviewer?.isAnonymous ?? false,
    rating,
    comment: review.comment?.trim() || null,
    replyComment: review.reviewReply?.comment ?? null,
    replyTime: review.reviewReply ? new Date(review.reviewReply.updateTime) : null,
    createTime: new Date(review.createTime),
    updateTime: new Date(review.updateTime),
  };
}

/**
 * Trae todas las reseñas de la ubicación configurada siguiendo `nextPageToken`.
 * https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list
 */
export async function listGoogleReviews(config: GoogleReviewsConfig): Promise<GoogleReviewsListing> {
  const token = await getGoogleReviewsAccessToken(config);
  const base = `https://mybusiness.googleapis.com/v4/accounts/${config.GBP_ACCOUNT_ID}/locations/${config.GBP_LOCATION_ID}/reviews`;

  const reviews: GoogleReviewRecord[] = [];
  let averageRating = 0;
  let totalReviewCount = 0;
  let pageToken: string | undefined;

  do {
    const url = new URL(base);
    url.searchParams.set("pageSize", String(GOOGLE_REVIEWS_PAGE_SIZE));
    url.searchParams.set("orderBy", "updateTime desc");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new GoogleReviewsApiError(
        response.status,
        `Business Profile ${response.status}: ${body.slice(0, 300)}`
      );
    }

    const page = responseSchema.parse(await response.json());
    averageRating = page.averageRating ?? averageRating;
    totalReviewCount = page.totalReviewCount ?? totalReviewCount;
    for (const review of page.reviews) {
      const record = toRecord(review);
      if (record) reviews.push(record);
    }
    pageToken = page.nextPageToken;
  } while (pageToken);

  return { reviews, averageRating, totalReviewCount };
}
