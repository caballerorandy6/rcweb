import { describe, expect, it } from "vitest";
import {
  INCLUDED_MINUTES_PER_MONTH,
  addMonths,
  businessToday,
  formatMinutes,
  monthOfDay,
  monthStart,
  monthStartInstant,
  summarizeMonth,
  workLogWindow,
} from "@/lib/maintenanceHours";

describe("monthStart", () => {
  it("returns the first day of the month in Houston as a UTC date", () => {
    expect(monthStart(new Date("2026-11-15T18:00:00Z")).toISOString()).toBe(
      "2026-11-01T00:00:00.000Z"
    );
  });

  it("is still the previous month in Houston late on the last evening", () => {
    // Nov 30, 9 p.m. CST = Dec 1, 03:00 UTC
    expect(monthStart(new Date("2026-12-01T03:00:00Z")).toISOString()).toBe(
      "2026-11-01T00:00:00.000Z"
    );
  });

  it("switches at midnight Houston time", () => {
    // Dec 1, 00:30 CST = Dec 1, 06:30 UTC
    expect(monthStart(new Date("2026-12-01T06:30:00Z")).toISOString()).toBe(
      "2026-12-01T00:00:00.000Z"
    );
  });
});

describe("businessToday", () => {
  it("formats the Houston calendar day", () => {
    expect(businessToday(new Date("2026-11-15T18:00:00Z"))).toBe("2026-11-15");
  });

  it("is still yesterday in Houston before 6 a.m. UTC", () => {
    expect(businessToday(new Date("2026-12-01T03:00:00Z"))).toBe("2026-11-30");
  });
});

describe("monthOfDay", () => {
  it("keeps the 1st of the month in its own month", () => {
    expect(monthOfDay(new Date("2026-11-01T00:00:00Z")).toISOString()).toBe(
      "2026-11-01T00:00:00.000Z"
    );
  });

  it("maps the last day to its month", () => {
    expect(monthOfDay(new Date("2026-10-31T00:00:00Z")).toISOString()).toBe(
      "2026-10-01T00:00:00.000Z"
    );
  });
});

describe("monthStartInstant", () => {
  it("is midnight in Houston on standard time", () => {
    expect(monthStartInstant(new Date("2026-12-01T00:00:00Z")).toISOString()).toBe(
      "2026-12-01T06:00:00.000Z"
    );
  });

  it("is midnight in Houston on daylight time", () => {
    expect(monthStartInstant(new Date("2026-07-01T00:00:00Z")).toISOString()).toBe(
      "2026-07-01T05:00:00.000Z"
    );
  });

  it("uses the offset of that midnight when the clocks change later that day", () => {
    // Nov 1, 2026: daylight time ends at 2 a.m., two hours after the month starts
    expect(monthStartInstant(new Date("2026-11-01T00:00:00Z")).toISOString()).toBe(
      "2026-11-01T05:00:00.000Z"
    );
  });

  it("round-trips with monthStart", () => {
    const december = new Date("2026-12-01T00:00:00Z");
    const start = monthStartInstant(december);
    expect(monthStart(start)).toEqual(december);
    expect(monthStart(new Date(start.getTime() - 1))).toEqual(new Date("2026-11-01T00:00:00Z"));
  });
});

describe("workLogWindow", () => {
  it("runs from the 1st of last month to today in Houston", () => {
    expect(workLogWindow(new Date("2026-11-15T18:00:00Z"))).toEqual({
      earliest: "2026-10-01",
      today: "2026-11-15",
    });
  });

  it("follows the Houston day late on the last evening of a month", () => {
    // Nov 30, 9 p.m. CST = Dec 1, 03:00 UTC
    expect(workLogWindow(new Date("2026-12-01T03:00:00Z"))).toEqual({
      earliest: "2026-10-01",
      today: "2026-11-30",
    });
  });

  it("reaches back into December from January", () => {
    expect(workLogWindow(new Date("2027-01-10T18:00:00Z")).earliest).toBe("2026-12-01");
  });
});

describe("addMonths", () => {
  it("moves to the first day of the next month", () => {
    expect(addMonths(new Date("2026-11-01T00:00:00Z"), 1).toISOString()).toBe(
      "2026-12-01T00:00:00.000Z"
    );
  });

  it("rolls over the year both ways", () => {
    expect(addMonths(new Date("2026-12-01T00:00:00Z"), 1).toISOString()).toBe(
      "2027-01-01T00:00:00.000Z"
    );
    expect(addMonths(new Date("2027-01-01T00:00:00Z"), -1).toISOString()).toBe(
      "2026-12-01T00:00:00.000Z"
    );
  });
});

describe("summarizeMonth", () => {
  it("adds the minutes and leaves no extra within the plan", () => {
    expect(summarizeMonth([30, 45])).toEqual({
      used: 75,
      included: INCLUDED_MINUTES_PER_MONTH,
      extra: 0,
    });
  });

  it("counts what goes over the 2 included hours", () => {
    expect(summarizeMonth([90, 60])).toEqual({ used: 150, included: 120, extra: 30 });
  });

  it("is empty for a month with no work", () => {
    expect(summarizeMonth([])).toEqual({ used: 0, included: 120, extra: 0 });
  });
});

describe("formatMinutes", () => {
  it.each([
    [0, "0 min"],
    [45, "45 min"],
    [60, "1 h"],
    [90, "1 h 30 min"],
    [120, "2 h"],
    [185, "3 h 5 min"],
  ])("%i → %s", (minutes, text) => {
    expect(formatMinutes(minutes)).toBe(text);
  });
});
