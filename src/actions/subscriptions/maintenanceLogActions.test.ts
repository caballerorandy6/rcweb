import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { create, findUnique, deleteMany, findReport, findSubscription } = vi.hoisted(() => ({
  findSubscription: vi.fn(),
  create: vi.fn(),
  findUnique: vi.fn(),
  deleteMany: vi.fn(),
  findReport: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/authGuard", () => ({ requireAdmin: async () => ({ authorized: true, userId: "admin" }) }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    maintenanceLog: { create, findUnique, deleteMany },
    maintenanceReport: { findFirst: findReport },
    subscription: { findUnique: findSubscription },
  },
}));

import { addMaintenanceLogAction } from "./addMaintenanceLogAction";
import { deleteMaintenanceLogAction } from "./deleteMaintenanceLogAction";
import { SENT_MONTH_ERROR } from "@/lib/maintenanceReport/sentMonth";

const subscriptionId = "11111111-1111-4111-8111-111111111111";
const entry = { subscriptionId, minutes: 30, description: "Updated the hours" };

beforeEach(() => {
  // Nov 15, noon in Houston
  vi.useFakeTimers({ now: new Date("2026-11-15T18:00:00Z") });
  findReport.mockResolvedValue(null);
  findSubscription.mockResolvedValue({ status: "active" });
});

afterEach(() => {
  vi.useRealTimers();
  vi.resetAllMocks();
});

describe("addMaintenanceLogAction", () => {
  it("saves an entry of the current month as a calendar day", async () => {
    expect(await addMaintenanceLogAction({ ...entry, workedOn: "2026-11-15" })).toEqual({ success: true });
    expect(create).toHaveBeenCalledWith({
      data: { ...entry, workedOn: new Date("2026-11-15T00:00:00.000Z") },
    });
  });

  it("accepts the 1st of last month, the oldest day the page lists", async () => {
    expect(await addMaintenanceLogAction({ ...entry, workedOn: "2026-10-01" })).toEqual({ success: true });
    expect(findReport).toHaveBeenCalledWith({
      where: { subscriptionId, month: new Date("2026-10-01T00:00:00.000Z"), status: "sent" },
      select: { id: true },
    });
  });

  it.each(["2026-09-30", "2026-06-10"])("rejects %s, a month the page no longer lists", async (workedOn) => {
    expect(await addMaintenanceLogAction({ ...entry, workedOn })).toEqual({
      success: false,
      error: "The date must be between 2026-10-01 and today",
    });
    expect(create).not.toHaveBeenCalled();
  });

  it("rejects a day that has not happened yet in Houston", async () => {
    expect((await addMaintenanceLogAction({ ...entry, workedOn: "2026-11-16" })).success).toBe(false);
    expect(create).not.toHaveBeenCalled();
  });

  it.each(["past_due", "unpaid", "cancelled"])("refuses a %s plan, whose page has no form", async (status) => {
    findSubscription.mockResolvedValueOnce({ status });

    expect(await addMaintenanceLogAction({ ...entry, workedOn: "2026-11-15" })).toEqual({
      success: false,
      error: "Work can only be logged on an active subscription",
    });
    expect(create).not.toHaveBeenCalled();
  });

  it("refuses a subscription that does not exist", async () => {
    findSubscription.mockResolvedValueOnce(null);

    expect(await addMaintenanceLogAction({ ...entry, workedOn: "2026-11-15" })).toEqual({
      success: false,
      error: "Subscription not found",
    });
    expect(create).not.toHaveBeenCalled();
  });

  it("leaves the hours of a month alone once its report was sent", async () => {
    findReport.mockResolvedValueOnce({ id: "report" });

    expect(await addMaintenanceLogAction({ ...entry, workedOn: "2026-10-20" })).toEqual({
      success: false,
      error: SENT_MONTH_ERROR,
    });
    expect(create).not.toHaveBeenCalled();
  });
});

describe("deleteMaintenanceLogAction", () => {
  const id = "22222222-2222-4222-8222-222222222222";

  it("removes an entry of a month that has not been reported", async () => {
    findUnique.mockResolvedValueOnce({ subscriptionId, workedOn: new Date("2026-11-03T00:00:00Z") });

    expect(await deleteMaintenanceLogAction({ id })).toEqual({ success: true });
    expect(deleteMany).toHaveBeenCalledWith({ where: { id } });
  });

  it("keeps an entry of a month whose report was sent", async () => {
    findUnique.mockResolvedValueOnce({ subscriptionId, workedOn: new Date("2026-10-31T00:00:00Z") });
    findReport.mockResolvedValueOnce({ id: "report" });

    expect(await deleteMaintenanceLogAction({ id })).toEqual({ success: false, error: SENT_MONTH_ERROR });
    expect(findReport.mock.calls[0][0].where.month).toEqual(new Date("2026-10-01T00:00:00.000Z"));
    expect(deleteMany).not.toHaveBeenCalled();
  });

  it("says so when another tab already removed the entry", async () => {
    findUnique.mockResolvedValueOnce(null);

    expect(await deleteMaintenanceLogAction({ id })).toEqual({
      success: false,
      error: "This entry no longer exists",
    });
    expect(deleteMany).not.toHaveBeenCalled();
  });
});
