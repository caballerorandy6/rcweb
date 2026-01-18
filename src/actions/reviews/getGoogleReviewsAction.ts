"use server";

import { testimonials, GOOGLE_REVIEW_URL } from "@/lib/data";
import type { GoogleReviewsData } from "@/types/review";

// Re-export types for backward compatibility
export type { GoogleReview, GoogleReviewsData } from "@/types/review";

export async function getGoogleReviewsAction(): Promise<GoogleReviewsData | null> {
  // Convert testimonials to GoogleReview format
  const reviews = testimonials.map((t) => ({
    authorName: t.author,
    rating: t.rating,
    relativeTimeDescription: t.time,
    text: t.content,
    time: t.time,
  }));

  return {
    reviews,
    averageRating: 5.0,
    totalReviews: reviews.length,
    placeUrl: GOOGLE_REVIEW_URL,
  };
}
