import { revalidatePath } from "next/cache";

/**
 * Pages that show the Google reviews (Testimonials and the LocalBusiness
 * JSON-LD) are prerendered: regenerate them, in both languages, whenever the
 * stored reviews change. They also expire on their own after
 * GOOGLE_REVIEWS_REFRESH_DAYS as a safety net (`revalidate` in each page).
 */
export function revalidatePagesWithReviews(): void {
  revalidatePath("/[locale]", "page");
  revalidatePath("/[locale]/web-developer-houston-tx", "page");
}
