import { BUSINESS_TIME_ZONE } from "@/lib/company";

/** The maintenance plan includes 2 hours of changes a month; unused time does not carry over */
export const INCLUDED_MINUTES_PER_MONTH = 120;

// Months are counted on the business calendar (BUSINESS_TIME_ZONE), so work
// logged late on the 30th in Houston does not slip into the next month's report

const yearMonth = new Intl.DateTimeFormat("en-US", {
  timeZone: BUSINESS_TIME_ZONE,
  year: "numeric",
  month: "numeric",
});

/**
 * First day of the month `date` falls in (Houston time), as midnight UTC: the
 * same shape Prisma returns for `@db.Date` columns like `workedOn` and `month`.
 */
export function monthStart(date: Date): Date {
  const parts = yearMonth.formatToParts(date);
  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  return new Date(Date.UTC(year, month - 1, 1));
}

const isoDay = new Intl.DateTimeFormat("en-CA", {
  timeZone: BUSINESS_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Today in Houston as YYYY-MM-DD, the default of the work log's date input */
export function businessToday(now: Date): string {
  return isoDay.format(now);
}

/**
 * Month of a calendar day read from a `@db.Date` column (midnight UTC). Not
 * `monthStart`: Nov 1 at 00:00 UTC is still Oct 31 in Houston.
 */
export function monthOfDay(day: Date): Date {
  return new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), 1));
}

const zoneClock = new Intl.DateTimeFormat("en-US", {
  timeZone: BUSINESS_TIME_ZONE,
  hourCycle: "h23",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

/** How far Houston's clock is from UTC at `instant` (negative: behind) */
function zoneOffsetMs(instant: Date): number {
  const part = Object.fromEntries(
    zoneClock.formatToParts(instant).map((p) => [p.type, Number(p.value)])
  );
  const wallClock = Date.UTC(part.year, part.month - 1, part.day, part.hour, part.minute, part.second);
  return wallClock - Math.floor(instant.getTime() / 1000) * 1000;
}

/**
 * The instant a month (a monthStart) begins in Houston: Nov 1 is 05:00 UTC
 * while daylight time lasts, Dec 1 is 06:00 UTC. Use it to compare a month
 * with timestamps like `createdAt`; `@db.Date` columns compare with the
 * month itself.
 */
export function monthStartInstant(month: Date): Date {
  const wallClock = month.getTime();
  // Second pass: the offset is read at the instant itself, not six hours off
  const approximate = wallClock - zoneOffsetMs(new Date(wallClock));
  return new Date(wallClock - zoneOffsetMs(new Date(approximate)));
}

/**
 * The days (YYYY-MM-DD) the work log accepts: from the 1st of last month,
 * the oldest month the admin page lists, to today in Houston.
 */
export function workLogWindow(now: Date): { earliest: string; today: string } {
  return {
    earliest: addMonths(monthStart(now), -1).toISOString().slice(0, 10),
    today: businessToday(now),
  };
}

/** First day of the month `delta` months away from `month` (a monthStart) */
export function addMonths(month: Date, delta: number): Date {
  return new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + delta, 1));
}

export interface MonthHours {
  used: number;
  included: number;
  /** Minutes over the plan, billed at the hourly rate after a quote */
  extra: number;
}

/** Minutes logged in a month against what the plan includes */
export function summarizeMonth(minutes: number[]): MonthHours {
  const used = minutes.reduce((sum, m) => sum + m, 0);
  return {
    used,
    included: INCLUDED_MINUTES_PER_MONTH,
    extra: Math.max(0, used - INCLUDED_MINUTES_PER_MONTH),
  };
}

/** "45 min", "2 h", "1 h 30 min" */
export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}
