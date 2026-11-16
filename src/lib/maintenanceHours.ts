/** The maintenance plan includes 2 hours of changes a month; unused time does not carry over */
export const INCLUDED_MINUTES_PER_MONTH = 120;

// Months are counted on the business calendar, so work logged late on the
// 30th in Houston does not slip into the next month's report
const BUSINESS_TIME_ZONE = "America/Chicago";

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
