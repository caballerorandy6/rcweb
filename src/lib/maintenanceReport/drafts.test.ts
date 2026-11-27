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

import { createMonthlyReportDrafts, reportMonthFor, startedBeforeMonthEnded } from "./drafts";

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

describe("startedBeforeMonthEnded", () => {
  const october = new Date("2026-10-01T00:00:00Z");

  it("counts a plan bought on the last evening of the month in Houston", () => {
    // Oct 31, 9 p.m. CDT = Nov 1, 02:00 UTC
    expect(startedBeforeMonthEnded(new Date("2026-11-01T02:00:00Z"), october)).toBe(true);
  });

  it("leaves out a plan bought just after midnight on the 1st", () => {
    // Nov 1, 00:30 CDT
    expect(startedBeforeMonthEnded(new Date("2026-11-01T05:30:00Z"), october)).toBe(false);
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
        // Houston midnights: Dec 1 on standard time, Nov 1 still on daylight time
        createdAt: { lt: new Date("2026-12-01T06:00:00Z") },
        OR: [
          { status: { not: "cancelled" } },
          { cancelledAt: { gte: new Date("2026-11-01T05:00:00Z") } },
        ],
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
