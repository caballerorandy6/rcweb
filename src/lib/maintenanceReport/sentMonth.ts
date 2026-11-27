import { prisma } from "@/lib/prisma";
import { monthOfDay } from "@/lib/maintenanceHours";

/** Shown when the work log of an already reported month is edited */
export const SENT_MONTH_ERROR =
  "The report for that month was already sent, so its hours can no longer change";

/**
 * Whether the customer already received the report of the month `workedOn`
 * (a `@db.Date` day) falls in. The email is rebuilt from the work log each
 * time it is viewed, so the log of a sent month stays as it was sent.
 */
export async function isMonthReported(subscriptionId: string, workedOn: Date): Promise<boolean> {
  const report = await prisma.maintenanceReport.findFirst({
    where: { subscriptionId, month: monthOfDay(workedOn), status: "sent" },
    select: { id: true },
  });
  return report !== null;
}
