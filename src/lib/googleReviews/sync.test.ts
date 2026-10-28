import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { tx, listGoogleReviews, revalidatePath } = vi.hoisted(() => ({
  tx: {
    googleReview: { upsert: vi.fn(), deleteMany: vi.fn(async () => ({ count: 1 })) },
    googleReviewSummary: { upsert: vi.fn() },
  },
  listGoogleReviews: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: { $transaction: vi.fn(async (fn: (t: typeof tx) => unknown) => fn(tx)) },
}));
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath }));
vi.mock("@/lib/googleReviews/api", () => ({ listGoogleReviews }));

import { syncGoogleReviews } from "./sync";

const env = {
  GOOGLE_OAUTH_CLIENT_ID: "id",
  GOOGLE_OAUTH_CLIENT_SECRET: "secret",
  GOOGLE_OAUTH_REFRESH_TOKEN: "refresh",
  GBP_ACCOUNT_ID: "1",
  GBP_LOCATION_ID: "2",
};

const record = (id: string) => ({
  id,
  reviewerName: "Ana",
  reviewerPhotoUrl: null,
  isAnonymous: false,
  rating: 5,
  comment: "Great",
  replyComment: null,
  replyTime: null,
  createTime: new Date("2026-10-01T00:00:00Z"),
  updateTime: new Date("2026-10-01T00:00:00Z"),
});

beforeEach(() => {
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("syncGoogleReviews", () => {
  it("upserts every review without touching `hidden`, stores the summary, prunes the rest and regenerates the home", async () => {
    listGoogleReviews.mockResolvedValueOnce({
      reviews: [record("a"), record("b")],
      averageRating: 4.5,
      totalReviewCount: 2,
    });

    const outcome = await syncGoogleReviews();

    expect(outcome).toEqual({
      ok: true,
      result: { totalReviewCount: 2, averageRating: 4.5, stored: 2, removed: 1 },
    });
    expect(tx.googleReview.upsert).toHaveBeenCalledTimes(2);
    const { id, ...data } = record("a");
    expect(tx.googleReview.upsert).toHaveBeenCalledWith({
      where: { id },
      create: { id, ...data },
      update: data,
    });
    expect(tx.googleReview.upsert.mock.calls[0][0].update).not.toHaveProperty("hidden");
    expect(tx.googleReviewSummary.upsert).toHaveBeenCalledWith({
      where: { id: 1 },
      create: { id: 1, averageRating: 4.5, totalReviewCount: 2 },
      update: { averageRating: 4.5, totalReviewCount: 2 },
    });
    expect(tx.googleReview.deleteMany).toHaveBeenCalledWith({ where: { id: { notIn: ["a", "b"] } } });
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("reports not_configured when a variable is missing and api_error when Google fails", async () => {
    vi.stubEnv("GBP_LOCATION_ID", "");
    await expect(syncGoogleReviews()).resolves.toMatchObject({ ok: false, error: "not_configured" });
    expect(listGoogleReviews).not.toHaveBeenCalled();

    vi.stubEnv("GBP_LOCATION_ID", "2");
    listGoogleReviews.mockRejectedValueOnce(new Error("boom"));
    await expect(syncGoogleReviews()).resolves.toEqual({ ok: false, error: "api_error", message: "boom" });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
