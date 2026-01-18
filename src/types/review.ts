/**
 * Types for Google Reviews
 */

export interface GoogleReview {
  authorName: string;
  authorPhotoUrl?: string;
  rating: number;
  relativeTimeDescription: string;
  text: string;
  time: string;
  profileUrl?: string;
}

export interface GoogleReviewsData {
  reviews: GoogleReview[];
  averageRating: number;
  totalReviews: number;
  placeUrl: string;
}
