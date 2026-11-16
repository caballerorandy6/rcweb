import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { isCronRequestAuthorized } from "@/lib/cronAuth";
import { runMonitoredCron } from "@/lib/cronMonitor";
import { createMonthlyReportDrafts, reportMonthFor } from "@/lib/maintenanceReport/drafts";

// Monthly Vercel cron (vercel.json, the 1st): drafts last month's report for
// every maintenance customer. Nothing is emailed; the admin fills in the
// figures and sends each one from /subscriptions/[id].
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isCronRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const drafts = await runMonitoredCron(
      "/api/cron/maintenance-reports",
      () => createMonthlyReportDrafts(reportMonthFor(new Date())),
      () => false // failures throw
    );
    return NextResponse.json(drafts);
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: "Failed to create the drafts" }, { status: 500 });
  }
}
