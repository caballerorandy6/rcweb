import { describe, expect, it } from "vitest";
import { addDays, parseDateString, resyncRange, toDateString, todayUTC } from "./dates";

describe("searchConsole/dates", () => {
  it("parses YYYY-MM-DD as midnight UTC and prints it back", () => {
    const date = parseDateString("2026-10-19");
    expect(date.toISOString()).toBe("2026-10-19T00:00:00.000Z");
    expect(toDateString(date)).toBe("2026-10-19");
  });

  it("rejects anything that is not a plain date", () => {
    expect(() => parseDateString("2026-10-19T10:00:00Z")).toThrow();
    expect(() => parseDateString("19/10/2026")).toThrow();
  });

  it("todayUTC drops the time of day", () => {
    expect(todayUTC(new Date("2026-10-27T23:59:59Z")).toISOString()).toBe(
      "2026-10-27T00:00:00.000Z"
    );
  });

  it("addDays crosses month boundaries", () => {
    expect(toDateString(addDays(parseDateString("2026-10-31"), 1))).toBe("2026-11-01");
    expect(toDateString(addDays(parseDateString("2026-11-01"), -1))).toBe("2026-10-31");
  });

  it("resyncRange ends yesterday and spans the requested number of days", () => {
    const { start, end } = resyncRange(7, new Date("2026-10-27T15:00:00Z"));
    expect(toDateString(end)).toBe("2026-10-26");
    expect(toDateString(start)).toBe("2026-10-20");
  });
});
