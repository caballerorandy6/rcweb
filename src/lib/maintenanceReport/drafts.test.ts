import { afterEach, describe, expect, it, vi } from "vitest";

const { findMany, createMany } = vi.hoisted(() => ({
  findMany: vi.fn(),
  createMany: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    subscription: { findMany },
    maintenanceReport: { createMany },
  },
}));

import { createMonthlyReportDrafts, reportMonthFor } from "./drafts";

afterEach(() => {
  vi.clearAllMocks();
});

describe("reportMonthFor", () => {
  it("covers the month that just ended", () => {
    // Dec 1, 8 a.m. in Houston
    expect(reportMonthFor(new Date("2026-12-01T14:00:00Z")).toISOString()).toBe(
      "2026-11-01T00:00:00.000Z"
    );
  });

  it("covers December when run on January 1st", () => {
    expect(reportMonthFor(new Date("2027-01-01T14:00:00Z")).toISOString()).toBe(
      "2026-12-01T00:00:00.000Z"
    );
  });
});

describe("createMonthlyReportDrafts", () => {
  const november = new Date("2026-11-01T00:00:00Z");

  it("drafts a report for every subscription that paid during the month", async () => {
    findMany.mockResolvedValueOnce([{ id: "a" }, { id: "b" }]);
    createMany.mockResolvedValueOnce({ count: 2 });

    const outcome = await createMonthlyReportDrafts(november);

    expect(findMany).toHaveBeenCalledWith({
      where: {
        createdAt: { lt: new Date("2026-12-01T00:00:00Z") },
        OR: [{ status: { not: "cancelled" } }, { cancelledAt: { gte: november } }],
      },
      select: { id: true },
    });
    expect(createMany).toHaveBeenCalledWith({
      data: [
        { subscriptionId: "a", month: november },
        { subscriptionId: "b", month: november },
      ],
      skipDuplicates: true,
    });
    expect(outcome).toEqual({ month: "2026-11-01", created: 2 });
  });

  it("reports nothing new when the drafts already exist", async () => {
    findMany.mockResolvedValueOnce([{ id: "a" }]);
    createMany.mockResolvedValueOnce({ count: 0 });

    expect(await createMonthlyReportDrafts(november)).toEqual({ month: "2026-11-01", created: 0 });
  });
});
