import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SubscriptionDetail from "@/components/admin/SubscriptionDetail";
import { addMonths, businessToday, monthOfDay, monthStart } from "@/lib/maintenanceHours";
import { reportMonthFor } from "@/lib/maintenanceReport/drafts";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata = genPageMetadata({
  title: "Subscription",
  description: "Customer, billing and onboarding of one maintenance plan.",
  pageRoute: "/subscriptions",
  noIndex: true,
});

// Always rendered per request (the admin layout reads the session)
export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function SubscriptionPage(props: { params: Params }) {
  const { id } = await props.params;
  const now = new Date();
  const currentMonth = monthStart(now);
  // Last month too: work logged on the 1st for the 31st lands there
  const previousMonth = addMonths(currentMonth, -1);

  const subscription = await prisma.subscription.findUnique({
    where: { id },
    select: {
      id: true,
      stripeSubscriptionId: true,
      name: true,
      email: true,
      locale: true,
      planName: true,
      amount: true,
      status: true,
      currentPeriodEnd: true,
      cancelAtPeriodEnd: true,
      cancelledAt: true,
      onboardingAt: true,
      createdAt: true,
      maintenanceLogs: {
        where: { workedOn: { gte: previousMonth } },
        orderBy: [{ workedOn: "desc" }, { createdAt: "desc" }],
        select: { id: true, workedOn: true, minutes: true, description: true },
      },
      maintenanceReports: {
        orderBy: { month: "desc" },
        take: 6,
        select: {
          id: true,
          month: true,
          status: true,
          errorsResolved: true,
          updatesApplied: true,
          backupsVerified: true,
          uptimePercent: true,
          visitors: true,
          pageViews: true,
          notes: true,
          sentAt: true,
        },
      },
    },
  });
  if (!subscription) notFound();

  const { maintenanceLogs, maintenanceReports, ...rest } = subscription;

  // Hours of each report's month come from the work log, not from the report
  const oldestReport = maintenanceReports.at(-1)?.month;
  const reportLogs = oldestReport
    ? await prisma.maintenanceLog.findMany({
        where: { subscriptionId: id, workedOn: { gte: oldestReport } },
        select: { workedOn: true, minutes: true },
      })
    : [];
  const minutesIn = (month: Date) =>
    reportLogs
      .filter((e) => monthOfDay(e.workedOn).getTime() === month.getTime())
      .map((e) => e.minutes);
  return (
    <SubscriptionDetail
      subscription={rest}
      workLog={{
        today: businessToday(now),
        months: [currentMonth, previousMonth].map((month) => ({
          month,
          entries: maintenanceLogs.filter((e) => monthOfDay(e.workedOn).getTime() === month.getTime()),
        })),
      }}
      reports={{
        lastMonth: reportMonthFor(now),
        items: maintenanceReports.map((r) => ({
          ...r,
          // Decimal cannot cross into the client form
          uptimePercent: r.uptimePercent === null ? null : r.uptimePercent.toNumber(),
          minutes: minutesIn(r.month),
        })),
      }}
    />
  );
}
