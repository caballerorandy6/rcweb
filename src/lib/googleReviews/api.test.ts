import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/googleReviews/auth", () => ({
  getGoogleReviewsAccessToken: vi.fn(async () => "token"),
}));

import { listGoogleReviews } from "./api";
import { GoogleReviewsApiError } from "./errors";

const config = {
  GOOGLE_OAUTH_CLIENT_ID: "id",
  GOOGLE_OAUTH_CLIENT_SECRET: "secret",
  GOOGLE_OAUTH_REFRESH_TOKEN: "refresh",
  GBP_ACCOUNT_ID: "1",
  GBP_LOCATION_ID: "2",
};

const review = (reviewId: string, starRating: string, extra: Record<string, unknown> = {}) => ({
  reviewId,
  reviewer: { displayName: `Author ${reviewId}`, profilePhotoUrl: "https://p/x.png" },
  starRating,
  createTime: "2026-10-01T10:00:00Z",
  updateTime: "2026-10-02T10:00:00Z",
  ...extra,
});

afterEach(() => vi.unstubAllGlobals());

describe("listGoogleReviews", () => {
  it("follows nextPageToken and maps the Google shape to GoogleReview rows", async () => {
    const urls: string[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: URL) => {
        urls.push(url.toString());
        const first = !url.searchParams.has("pageToken");
        return new Response(
          JSON.stringify(
            first
              ? {
                  reviews: [
                    review("a", "FIVE", {
                      comment: "Great",
                      reviewReply: { comment: "Thanks", updateTime: "2026-10-03T10:00:00Z" },
                    }),
                    review("b", "STAR_RATING_UNSPECIFIED"),
                  ],
                  averageRating: 4.8,
                  totalReviewCount: 3,
                  nextPageToken: "p2",
                }
              : { reviews: [review("c", "THREE", { reviewer: { isAnonymous: true } })] }
          ),
          { status: 200 }
        );
      })
    );

    const listing = await listGoogleReviews(config);

    expect(urls).toHaveLength(2);
    expect(urls[0]).toContain("/v4/accounts/1/locations/2/reviews?pageSize=50");
    expect(urls[1]).toContain("pageToken=p2");
    expect(listing.averageRating).toBe(4.8);
    expect(listing.totalReviewCount).toBe(3);
    // La reseña sin estrellas válidas se descarta
    expect(listing.reviews.map((r) => r.id)).toEqual(["a", "c"]);
    expect(listing.reviews[0]).toMatchObject({
      reviewerName: "Author a",
      reviewerPhotoUrl: "https://p/x.png",
      isAnonymous: false,
      rating: 5,
      comment: "Great",
      replyComment: "Thanks",
      replyTime: new Date("2026-10-03T10:00:00Z"),
      createTime: new Date("2026-10-01T10:00:00Z"),
    });
    expect(listing.reviews[1]).toMatchObject({
      reviewerName: "A Google user",
      reviewerPhotoUrl: null,
      isAnonymous: true,
      rating: 3,
      comment: null,
      replyComment: null,
      replyTime: null,
    });
  });

  it("treats an empty body as no reviews and surfaces HTTP errors", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 200 })));
    await expect(listGoogleReviews(config)).resolves.toEqual({
      reviews: [],
      averageRating: 0,
      totalReviewCount: 0,
    });

    vi.stubGlobal("fetch", vi.fn(async () => new Response("denied", { status: 403 })));
    await expect(listGoogleReviews(config)).rejects.toBeInstanceOf(GoogleReviewsApiError);
  });
});
