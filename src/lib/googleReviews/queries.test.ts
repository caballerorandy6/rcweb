import { afterEach, describe, expect, it, vi } from "vitest";

const { prisma } = vi.hoisted(() => ({
  prisma: {
    googleReviewSummary: { findUnique: vi.fn() },
    googleReview: { findMany: vi.fn() },
  },
}));
vi.mock("@/lib/prisma", () => ({ prisma }));
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

import { getPublicGoogleReviews } from "./queries";

afterEach(() => vi.clearAllMocks());

describe("getPublicGoogleReviews", () => {
  it("returns null before the first sync, when the profile has no reviews, or when the database fails", async () => {
    prisma.googleReviewSummary.findUnique.mockResolvedValueOnce(null);
    prisma.googleReview.findMany.mockResolvedValueOnce([]);
    await expect(getPublicGoogleReviews()).resolves.toBeNull();

    prisma.googleReviewSummary.findUnique.mockResolvedValueOnce({ id: 1, averageRating: 0, totalReviewCount: 0 });
    prisma.googleReview.findMany.mockResolvedValueOnce([]);
    await expect(getPublicGoogleReviews()).resolves.toBeNull();

    prisma.googleReviewSummary.findUnique.mockRejectedValueOnce(new Error("db down"));
    prisma.googleReview.findMany.mockResolvedValueOnce([]);
    await expect(getPublicGoogleReviews()).resolves.toBeNull();
  });

  it("maps visible reviews with the original text only", async () => {
    const syncedAt = new Date("2026-10-28T10:00:00Z");
    prisma.googleReviewSummary.findUnique.mockResolvedValueOnce({ id: 1, averageRating: 4.7, totalReviewCount: 9, syncedAt });
    prisma.googleReview.findMany.mockResolvedValueOnce([
      {
        id: "r1",
        reviewerName: "Ana",
        reviewerPhotoUrl: null,
        isAnonymous: false,
        rating: 5,
        comment: "(Translated by Google) Great job\n\n(Original)\nGran trabajo",
        createTime: new Date("2026-02-12T00:00:00Z"),
      },
    ]);

    await expect(getPublicGoogleReviews()).resolves.toEqual({
      averageRating: 4.7,
      totalReviewCount: 9,
      syncedAt,
      reviews: [
        { id: "r1", author: "Ana", rating: 5, photoUrl: null, text: "Gran trabajo", createTime: new Date("2026-02-12T00:00:00Z") },
      ],
    });
    expect(prisma.googleReview.findMany.mock.calls[0][0]).toMatchObject({
      where: { hidden: false, comment: { not: null } },
      orderBy: { createTime: "desc" },
    });
  });

  it("keeps the profile photo except on anonymous reviews", async () => {
    prisma.googleReviewSummary.findUnique.mockResolvedValueOnce({ id: 1, averageRating: 5, totalReviewCount: 2, syncedAt: new Date() });
    const base = { rating: 5, comment: "Great", createTime: new Date("2026-02-12T00:00:00Z"), reviewerPhotoUrl: "https://p/x.png" };
    prisma.googleReview.findMany.mockResolvedValueOnce([
      { ...base, id: "r1", reviewerName: "Ana", isAnonymous: false },
      { ...base, id: "r2", reviewerName: "A Google user", isAnonymous: true },
    ]);

    const result = await getPublicGoogleReviews();

    expect(result?.reviews.map((review) => review.photoUrl)).toEqual(["https://p/x.png", null]);
  });
});
