import { beforeEach, describe, expect, it, vi } from "vitest";

// vi.mock is hoisted above the imports, so the mocks it uses must be too
const { db, captureException } = vi.hoisted(() => ({
  db: {
    count: vi.fn(),
    create: vi.fn(),
    findFirst: vi.fn(),
    deleteMany: vi.fn(),
  },
  captureException: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({ prisma: { rateLimitHit: db } }));
vi.mock("@sentry/nextjs", () => ({ captureException }));

import { createLimiter } from "./rateLimit";

const limiter = createLimiter({ prefix: "test", limit: 3, windowMs: 60_000 });

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(Math, "random").mockReturnValue(0.5); // never run the cleanup
});

describe("createLimiter", () => {
  it("records the hit and allows while under the limit", async () => {
    db.count.mockResolvedValue(1);

    const result = await limiter.limit("1.2.3.4");

    expect(result.success).toBe(true);
    expect(result.remaining).toBe(1);
    expect(db.create).toHaveBeenCalledWith({ data: { key: "test:1.2.3.4" } });
  });

  it("blocks without recording once the limit is reached", async () => {
    db.count.mockResolvedValue(3);
    db.findFirst.mockResolvedValue({ createdAt: new Date(1_000) });

    const result = await limiter.limit("1.2.3.4");

    expect(result.success).toBe(false);
    expect(result.reset).toBe(61_000);
    expect(db.create).not.toHaveBeenCalled();
  });

  it("only looks at hits inside the window", async () => {
    db.count.mockResolvedValue(0);
    const before = Date.now();

    await limiter.limit("k");

    const where = db.count.mock.calls[0][0].where;
    expect(where.key).toBe("test:k");
    expect(where.createdAt.gt.getTime()).toBeGreaterThanOrEqual(before - 60_000);
  });

  it("allows the request and reports when the database fails", async () => {
    db.count.mockRejectedValue(new Error("db down"));

    const result = await limiter.limit("k");

    expect(result.success).toBe(true);
    expect(captureException).toHaveBeenCalledOnce();
  });

  it("isBlocked / hit / reset support the login lockout", async () => {
    db.count.mockResolvedValue(3);
    expect(await limiter.isBlocked("ana@example.com")).toBe(true);

    await limiter.hit("ana@example.com");
    expect(db.create).toHaveBeenCalledWith({ data: { key: "test:ana@example.com" } });

    await limiter.reset("ana@example.com");
    expect(db.deleteMany).toHaveBeenCalledWith({ where: { key: "test:ana@example.com" } });
  });
});
