import type { Locale } from "@/i18n/routing";
import { subscriptionPlanName } from "@/lib/maintenancePlan";
import { summarizeMonth, type MonthHours } from "@/lib/maintenanceHours";

/** Everything the monthly report email shows; null figures are left out */
export interface MaintenanceReportEmailData {
  customerName: string;
  locale: Locale;
  planName: string;
  /** First day of the month the report covers (midnight UTC) */
  month: Date;
  hours: MonthHours;
  errorsResolved: number | null;
  updatesApplied: number | null;
  backupsVerified: boolean | null;
  uptimePercent: number | null;
  visitors: number | null;
  pageViews: number | null;
  notes: string | null;
}

export interface MaintenanceReportRow {
  month: Date;
  errorsResolved: number | null;
  updatesApplied: number | null;
  backupsVerified: boolean | null;
  /** Prisma Decimal or a plain number */
  uptimePercent: { toNumber(): number } | number | null;
  visitors: number | null;
  pageViews: number | null;
  notes: string | null;
  subscription: { name: string; locale: Locale; planName: string };
}

/**
 * The email of one report: figures as the admin saved them, hours from the
 * work log minutes of the same month and the plan name in the customer's
 * language. Shared by the preview and the send action.
 */
export function buildMaintenanceReportEmail(
  report: MaintenanceReportRow,
  minutes: number[]
): MaintenanceReportEmailData {
  const { subscription, uptimePercent, notes, ...figures } = report;
  return {
    customerName: subscription.name,
    locale: subscription.locale,
    planName: subscriptionPlanName(subscription.planName, subscription.locale),
    hours: summarizeMonth(minutes),
    ...figures,
    uptimePercent: typeof uptimePercent === "object" && uptimePercent !== null ? uptimePercent.toNumber() : uptimePercent,
    notes: notes?.trim() || null,
  };
}
