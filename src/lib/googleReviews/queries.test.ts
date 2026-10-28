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

  it("maps visible reviews with the translated text only", async () => {
    const syncedAt = new Date("2026-10-28T10:00:00Z");
    prisma.googleReviewSummary.findUnique.mockResolvedValueOnce({ id: 1, averageRating: 4.7, totalReviewCount: 9, syncedAt });
    prisma.googleReview.findMany.mockResolvedValueOnce([
      {
        id: "r1",
        reviewerName: "Ana",
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
        { id: "r1", author: "Ana", rating: 5, text: "Great job", createTime: new Date("2026-02-12T00:00:00Z") },
      ],
    });
    expect(prisma.googleReview.findMany.mock.calls[0][0]).toMatchObject({
      where: { hidden: false, comment: { not: null } },
      orderBy: { createTime: "desc" },
    });
  });
});
