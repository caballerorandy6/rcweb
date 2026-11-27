import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { updateMany, findUnique, createMany } = vi.hoisted(() => ({
  updateMany: vi.fn(),
  findUnique: vi.fn(),
  createMany: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/authGuard", () => ({ requireAdmin: async () => ({ authorized: true, userId: "admin" }) }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    subscription: { updateMany, findUnique },
    maintenanceReport: { createMany },
  },
}));

import { markOnboardedAction } from "./markOnboardedAction";
import { createMaintenanceReportDraftAction } from "./createMaintenanceReportDraftAction";

const subscriptionId = "11111111-1111-4111-8111-111111111111";

beforeEach(() => {
  // Nov 15, noon in Houston: last month is October
  vi.useFakeTimers({ now: new Date("2026-11-15T18:00:00Z") });
});

afterEach(() => {
  vi.useRealTimers();
  vi.resetAllMocks();
});

describe("markOnboardedAction", () => {
  it("dates the onboarding of an active plan that has none", async () => {
    updateMany.mockResolvedValueOnce({ count: 1 });

    expect(await markOnboardedAction({ subscriptionId })).toEqual({ success: true });
    expect(updateMany).toHaveBeenCalledWith({
      where: { id: subscriptionId, onboardingAt: null, status: "active" },
      data: { onboardingAt: new Date("2026-11-15T18:00:00Z") },
    });
  });

  it("keeps the first date on a second click", async () => {
    updateMany.mockResolvedValueOnce({ count: 0 });
    findUnique.mockResolvedValueOnce({ onboardingAt: new Date("2026-11-01T15:00:00Z") });

    expect(await markOnboardedAction({ subscriptionId })).toEqual({ success: true });
  });

  it("refuses a plan that is not active", async () => {
    updateMany.mockResolvedValueOnce({ count: 0 });
    findUnique.mockResolvedValueOnce({ onboardingAt: null });

    expect(await markOnboardedAction({ subscriptionId })).toEqual({
      success: false,
      error: "Only an active subscription can be onboarded",
    });
  });

  it("refuses a subscription that does not exist", async () => {
    updateMany.mockResolvedValueOnce({ count: 0 });
    findUnique.mockResolvedValueOnce(null);

    expect(await markOnboardedAction({ subscriptionId })).toEqual({
      success: false,
      error: "Subscription not found",
    });
  });

  it("rejects an id that is not a uuid", async () => {
    expect((await markOnboardedAction({ subscriptionId: "1' or 1=1" })).success).toBe(false);
    expect(updateMany).not.toHaveBeenCalled();
  });
});

describe("createMaintenanceReportDraftAction", () => {
  const noReport = { success: false, error: "This subscription has no report for last month" };

  it("drafts October for a plan that was paying in October", async () => {
    findUnique.mockResolvedValueOnce({ status: "active", createdAt: new Date("2026-10-20T15:00:00Z") });

    expect(await createMaintenanceReportDraftAction({ subscriptionId })).toEqual({ success: true });
    expect(createMany).toHaveBeenCalledWith({
      data: [{ subscriptionId, month: new Date("2026-10-01T00:00:00.000Z") }],
      skipDuplicates: true,
    });
  });

  it("counts a plan bought on the last evening of October in Houston", async () => {
    findUnique.mockResolvedValueOnce({ status: "past_due", createdAt: new Date("2026-11-01T04:30:00Z") });

    expect(await createMaintenanceReportDraftAction({ subscriptionId })).toEqual({ success: true });
  });

  it("refuses a plan that started in November", async () => {
    findUnique.mockResolvedValueOnce({ status: "active", createdAt: new Date("2026-11-01T05:30:00Z") });

    expect(await createMaintenanceReportDraftAction({ subscriptionId })).toEqual(noReport);
    expect(createMany).not.toHaveBeenCalled();
  });

  it("refuses a cancelled plan", async () => {
    findUnique.mockResolvedValueOnce({ status: "cancelled", createdAt: new Date("2026-08-10T12:00:00Z") });

    expect(await createMaintenanceReportDraftAction({ subscriptionId })).toEqual(noReport);
    expect(createMany).not.toHaveBeenCalled();
  });

  it("refuses a subscription that does not exist", async () => {
    findUnique.mockResolvedValueOnce(null);

    expect(await createMaintenanceReportDraftAction({ subscriptionId })).toEqual({
      success: false,
      error: "Subscription not found",
    });
    expect(createMany).not.toHaveBeenCalled();
  });
});
