import { prisma } from "@/lib/prisma";
import { addMonths } from "@/lib/maintenanceHours";
import { buildMaintenanceReportEmail, type MaintenanceReportEmailData } from "./email";

export interface LoadedMaintenanceReport {
  subscriptionId: string;
  customerEmail: string;
  status: "draft" | "sent";
  email: MaintenanceReportEmailData;
}

/** A report as its email would show it right now, or null if it does not exist */
export async function loadMaintenanceReportEmail(id: string): Promise<LoadedMaintenanceReport | null> {
  const report = await prisma.maintenanceReport.findUnique({
    where: { id },
    select: {
      month: true,
      status: true,
      errorsResolved: true,
      updatesApplied: true,
      backupsVerified: true,
      uptimePercent: true,
      visitors: true,
      pageViews: true,
      notes: true,
      subscription: { select: { id: true, email: true, name: true, locale: true, planName: true } },
    },
  });
  if (!report) return null;

  const logs = await prisma.maintenanceLog.findMany({
    where: {
      subscriptionId: report.subscription.id,
      workedOn: { gte: report.month, lt: addMonths(report.month, 1) },
    },
    select: { minutes: true },
  });

  return {
    subscriptionId: report.subscription.id,
    customerEmail: report.subscription.email,
    status: report.status,
    email: buildMaintenanceReportEmail(report, logs.map((l) => l.minutes)),
  };
}
