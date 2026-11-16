import * as Sentry from "@sentry/nextjs";
import vercelConfig from "../../vercel.json";

// Thrown inside the monitor so Sentry records an error check-in; never escapes.
class CronJobFailed extends Error {}

/** Schedule of a cron in vercel.json, so the Sentry monitor never drifts from it. */
export function cronSchedule(path: string): string {
  const cron = vercelConfig.crons.find((entry) => entry.path === path);
  if (!cron) throw new Error(`No cron for ${path} in vercel.json`);
  return cron.schedule;
}

/**
 * Runs a Vercel cron job inside a Sentry cron monitor (created on the first
 * check-in). A result that `isFailure` flags, or a thrown error, is an error
 * check-in; a run that never arrives is a missed one. Thrown errors propagate.
 */
export async function runMonitoredCron<T>(
  path: string,
  job: () => Promise<T>,
  isFailure: (result: T) => boolean
): Promise<T> {
  let result: T | undefined;
  try {
    await Sentry.withMonitor(
      path.split("/").pop()!,
      async () => {
        result = await job();
        if (isFailure(result)) throw new CronJobFailed(path);
      },
      {
        schedule: { type: "crontab", value: cronSchedule(path) },
        timezone: "UTC", // Vercel runs crons in UTC
        checkinMargin: 30,
        maxRuntime: 10,
      }
    );
  } catch (error) {
    if (!(error instanceof CronJobFailed)) throw error;
  }
  return result as T;
}
