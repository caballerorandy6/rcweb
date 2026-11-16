import { beforeEach, describe, expect, it, vi } from "vitest";

const { withMonitor } = vi.hoisted(() => ({
  // Mirrors the SDK: runs the callback, records ok/error, rethrows.
  withMonitor: vi.fn(async (_slug: string, callback: () => Promise<unknown>) => callback()),
}));
vi.mock("@sentry/nextjs", () => ({ withMonitor }));

import vercelConfig from "../../vercel.json";
import { cronSchedule, runMonitoredCron } from "./cronMonitor";

beforeEach(() => {
  withMonitor.mockClear();
});

describe("cronSchedule", () => {
  it("reads every cron's schedule from vercel.json", () => {
    for (const cron of vercelConfig.crons) {
      expect(cronSchedule(cron.path)).toBe(cron.schedule);
    }
  });

  it("throws for a path that is not a cron", () => {
    expect(() => cronSchedule("/api/cron/nope")).toThrow("/api/cron/nope");
  });
});

describe("runMonitoredCron", () => {
  it("uses the last path segment as slug and the vercel.json schedule in UTC", async () => {
    await runMonitoredCron("/api/cron/search-console", async () => ({ ok: true }), () => false);

    expect(withMonitor).toHaveBeenCalledWith("search-console", expect.any(Function), {
      schedule: { type: "crontab", value: cronSchedule("/api/cron/search-console") },
      timezone: "UTC",
      checkinMargin: 30,
      maxRuntime: 10,
    });
  });

  it("returns the result of a successful job", async () => {
    const result = await runMonitoredCron("/api/cron/google-reviews", async () => ({ ok: true, n: 5 }), (r) => !r.ok);
    expect(result).toEqual({ ok: true, n: 5 });
  });

  it("marks a failed result as an error check-in but still returns it", async () => {
    const failed = { ok: false, error: "api_error" };
    let checkInError: unknown;
    withMonitor.mockImplementationOnce(async (_slug, callback) => {
      try {
        return await callback();
      } catch (error) {
        checkInError = error;
        throw error;
      }
    });

    const result = await runMonitoredCron("/api/cron/google-reviews", async () => failed, (r) => !r.ok);

    expect(result).toBe(failed);
    expect(checkInError).toBeInstanceOf(Error);
  });

  it("propagates an error thrown by the job", async () => {
    const boom = new Error("db down");
    await expect(
      runMonitoredCron("/api/cron/maintenance-reports", async () => Promise.reject(boom), () => false)
    ).rejects.toBe(boom);
  });
});
