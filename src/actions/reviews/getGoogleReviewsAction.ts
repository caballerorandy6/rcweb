"use server";

import { unstable_cache } from "next/cache";

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

interface PlacesApiReview {
  authorAttribution?: {
    displayName: string;
    photoUri?: string;
    uri?: string;
  };
  rating: number;
  relativePublishTimeDescription: string;
  text?: {
    text: string;
  };
  publishTime: string;
}

interface PlacesApiResponse {
  reviews?: PlacesApiReview[];
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
}

async function fetchGoogleReviews(): Promise<GoogleReviewsData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    console.error("Missing GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID");
    return null;
  }

  try {
    // Using Places API (New) - places.googleapis.com
    const url = `https://places.googleapis.com/v1/places/${placeId}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "reviews,rating,userRatingCount,googleMapsUri",
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Places API error:", response.status, errorText);
      return null;
    }

    const data: PlacesApiResponse = await response.json();

    if (!data.reviews || data.reviews.length === 0) {
      console.warn("No reviews found for place:", placeId);
      return {
        reviews: [],
        averageRating: data.rating || 0,
        totalReviews: data.userRatingCount || 0,
        placeUrl: data.googleMapsUri || `https://www.google.com/maps/place/?q=place_id:${placeId}`,
      };
    }

    const reviews: GoogleReview[] = data.reviews.map((review) => ({
      authorName: review.authorAttribution?.displayName || "Anonymous",
      authorPhotoUrl: review.authorAttribution?.photoUri,
      rating: review.rating,
      relativeTimeDescription: review.relativePublishTimeDescription,
      text: review.text?.text || "",
      time: review.publishTime,
      profileUrl: review.authorAttribution?.uri,
    }));

    return {
      reviews,
      averageRating: data.rating || 0,
      totalReviews: data.userRatingCount || 0,
      placeUrl: data.googleMapsUri || `https://www.google.com/maps/place/?q=place_id:${placeId}`,
    };
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    return null;
  }
}

// Cache the reviews for 24 hours to minimize API calls
const getCachedGoogleReviews = unstable_cache(
  fetchGoogleReviews,
  ["google-reviews"],
  { revalidate: 86400, tags: ["google-reviews"] }
);

export async function getGoogleReviewsAction(): Promise<GoogleReviewsData | null> {
  return getCachedGoogleReviews();
}
