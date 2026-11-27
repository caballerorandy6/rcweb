import Link from "next/link";
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import type { CustomerLocale, SubscriptionStatus } from "@/generated/prisma/enums";
import { ADMIN_ROUTES } from "@/config/adminRoutes";
import { formatCurrency, formatDate } from "@/lib/utils";
import MarkOnboardedButton from "@/components/admin/MarkOnboardedButton";
import MaintenanceLogForm from "@/components/admin/MaintenanceLogForm";
import DeleteMaintenanceLogButton from "@/components/admin/DeleteMaintenanceLogButton";
import MaintenanceReportForm, { type ReportFigures } from "@/components/admin/MaintenanceReportForm";
import CreateReportDraftButton from "@/components/admin/CreateReportDraftButton";
import { formatMinutes, summarizeMonth } from "@/lib/maintenanceHours";
import { startedBeforeMonthEnded } from "@/lib/maintenanceReport/drafts";

export interface AdminSubscriptionDetail {
  id: string;
  stripeSubscriptionId: string;
  name: string;
  email: string;
  locale: CustomerLocale;
  planName: string;
  amount: number;
  status: SubscriptionStatus;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  cancelledAt: Date | null;
  onboardingAt: Date | null;
  createdAt: Date;
}

export interface AdminWorkLog {
  /** YYYY-MM-DD in Houston */
  today: string;
  /** Oldest day the log accepts: the 1st of the previous month */
  earliest: string;
  /** Current month first, then the previous one */
  months: {
    month: Date;
    entries: { id: string; workedOn: Date; minutes: number; description: string }[];
  }[];
}

export interface AdminReports {
  /** The month the next report covers (the one that just ended) */
  lastMonth: Date;
  /** Newest first */
  items: (ReportFigures & {
    id: string;
    month: Date;
    status: "draft" | "sent";
    sentAt: Date | null;
    /** Work log minutes of that month */
    minutes: number[];
  })[];
}

// workedOn and month are calendar days stored at midnight UTC
const utcDay = { timeZone: "UTC" } as const;
const monthLabel = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "long", year: "numeric" });

const STATUS_BADGES: Record<SubscriptionStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-green-500/10 text-green-400 border-green-500/40" },
  past_due: { label: "Past due", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/40" },
  unpaid: { label: "Unpaid", className: "bg-orange-500/10 text-orange-400 border-orange-500/40" },
  cancelled: { label: "Cancelled", className: "bg-red-500/10 text-red-400 border-red-500/40" },
};

const LOCALE_LABELS: Record<CustomerLocale, string> = { en: "English", es: "Spanish" };

/** What onboarding covers; the admin checks it by hand before marking it done */
const ONBOARDING_STEPS = [
  "Uptime monitor on the customer's site",
  "Sentry project receiving errors",
  "Backups scheduled and one restore tested",
  "Access to hosting, domain and repository",
  "GA4 and Search Console shared with the customer",
];

const card =
  "bg-linear-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-xl p-5 sm:p-6 shadow-xl shadow-black/20";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section aria-label={title} className={card}>
      <h2 className="text-xl text-gold font-iceland mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm">
      <dt className="text-gray-400">{label}</dt>
      <dd className="text-white text-right">{children}</dd>
    </div>
  );
}

// Live mode: test IDs look the same, so there is no way to tell them apart
function stripeUrl(stripeSubscriptionId: string): string {
  return `https://dashboard.stripe.com/subscriptions/${stripeSubscriptionId}`;
}

function WorkLogMonth({ month, entries }: AdminWorkLog["months"][number]) {
  const hours = summarizeMonth(entries.map((e) => e.minutes));
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-gray-700/50 pb-2">
        <h3 className="text-sm font-semibold text-gray-300">{monthLabel.format(month)}</h3>
        <p className={`text-sm tabular-nums ${hours.extra > 0 ? "text-amber-400" : "text-gray-400"}`}>
          {formatMinutes(hours.used)} of {formatMinutes(hours.included)}
          {hours.extra > 0 ? ` · ${formatMinutes(hours.extra)} over (quote before billing)` : ""}
        </p>
      </div>
      {entries.length === 0 ? (
        <p className="py-3 text-sm text-gray-500">No work logged.</p>
      ) : (
        <ul className="divide-y divide-gray-700/50">
          {entries.map((entry) => (
            <li key={entry.id} className="flex items-start gap-3 py-2 text-sm">
              <span className="w-24 shrink-0 text-gray-400 tabular-nums">
                {formatDate(entry.workedOn, utcDay)}
              </span>
              <span className="min-w-0 flex-1 text-white break-words">{entry.description}</span>
              <span className="shrink-0 text-gray-300 tabular-nums">{formatMinutes(entry.minutes)}</span>
              <DeleteMaintenanceLogButton id={entry.id} label={entry.description} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** What a sent report said, line by line; blank figures were left out of the email */
function SentFigures({ report }: { report: AdminReports["items"][number] }) {
  const lines: [string, string][] = [];
  if (report.errorsResolved !== null) lines.push(["Errors resolved", String(report.errorsResolved)]);
  if (report.updatesApplied !== null) lines.push(["Updates applied", String(report.updatesApplied)]);
  if (report.backupsVerified !== null) lines.push(["Backups", report.backupsVerified ? "Verified" : "Not verified"]);
  if (report.uptimePercent !== null) lines.push(["Uptime", `${report.uptimePercent}%`]);
  if (report.visitors !== null) lines.push(["Visitors", report.visitors.toLocaleString("en-US")]);
  if (report.pageViews !== null) lines.push(["Page views", report.pageViews.toLocaleString("en-US")]);
  return (
    <dl className="space-y-2">
      {lines.map(([label, value]) => (
        <Row key={label} label={label}>
          {value}
        </Row>
      ))}
      {report.notes ? <p className="pt-2 text-sm text-gray-300 whitespace-pre-line">{report.notes}</p> : null}
    </dl>
  );
}

function ReportItem({
  report,
  subscription,
}: {
  report: AdminReports["items"][number];
  subscription: Pick<AdminSubscriptionDetail, "id" | "email" | "locale">;
}) {
  const hours = summarizeMonth(report.minutes);
  const sent = report.status === "sent";
  return (
    <div className="rounded-lg border border-gray-700/50 bg-gray-900/30 p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-white">{monthLabel.format(report.month)}</h3>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
            sent
              ? "bg-green-500/10 text-green-400 border-green-500/40"
              : "bg-gray-500/10 text-gray-300 border-gray-500/40"
          }`}
        >
          {sent ? `Sent ${formatDate(report.sentAt)}` : "Draft"}
        </span>
        <span className="ml-auto text-xs text-gray-400 tabular-nums">
          Hours: {formatMinutes(hours.used)} of {formatMinutes(hours.included)}
        </span>
      </div>
      {sent ? (
        <>
          <SentFigures report={report} />
          <a
            href={`/subscriptions/${subscription.id}/reports/${report.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-sm text-gold hover:underline"
          >
            View email
            <ArrowTopRightOnSquareIcon className="w-4 h-4" aria-hidden="true" />
          </a>
        </>
      ) : (
        <MaintenanceReportForm
          reportId={report.id}
          subscriptionId={subscription.id}
          customerEmail={subscription.email}
          figures={report}
          customerLanguage={LOCALE_LABELS[subscription.locale]}
        />
      )}
    </div>
  );
}

/** One maintenance customer: billing, onboarding, work log and monthly reports */
export default function SubscriptionDetail({
  subscription,
  workLog,
  reports,
}: {
  subscription: AdminSubscriptionDetail;
  workLog: AdminWorkLog;
  reports: AdminReports;
}) {
  const lastMonthLabel = monthLabel.format(reports.lastMonth);
  const hasLastMonth = reports.items.some((r) => r.month.getTime() === reports.lastMonth.getTime());
  // Same rule as the cron: the customer was paying before last month ended
  const coversLastMonth = startedBeforeMonthEnded(subscription.createdAt, reports.lastMonth);
  const status = STATUS_BADGES[subscription.status];
  const isActive = subscription.status === "active";

  return (
    <div className="space-y-6 font-inter">
      <div>
        <Link
          href={ADMIN_ROUTES.subscriptions}
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gold transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" aria-hidden="true" />
          Subscriptions
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-iceland text-gold">{subscription.name}</h1>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${status.className}`}
          >
            {status.label}
          </span>
        </div>
        <p className="mt-1 text-gray-400">{subscription.email}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Billing">
          <dl className="space-y-2">
            <Row label="Plan">{subscription.planName}</Row>
            <Row label="Amount">{formatCurrency(subscription.amount)}/mo</Row>
            <Row label="Customer language">{LOCALE_LABELS[subscription.locale]}</Row>
            <Row label="Started">{formatDate(subscription.createdAt)}</Row>
            {subscription.status === "cancelled" ? (
              <Row label="Cancelled">{formatDate(subscription.cancelledAt)}</Row>
            ) : (
              <Row label={subscription.cancelAtPeriodEnd ? "Ends" : "Next billing"}>
                <span className={subscription.cancelAtPeriodEnd ? "text-yellow-400" : undefined}>
                  {formatDate(subscription.currentPeriodEnd)}
                </span>
              </Row>
            )}
          </dl>
          <a
            href={stripeUrl(subscription.stripeSubscriptionId)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm text-gold hover:underline"
          >
            View in Stripe
            <ArrowTopRightOnSquareIcon className="w-4 h-4" aria-hidden="true" />
          </a>
        </Card>

        <Card title="Onboarding">
          {subscription.onboardingAt ? (
            <p className="text-sm text-green-400">Done on {formatDate(subscription.onboardingAt)}</p>
          ) : (
            <>
              <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-gray-300">
                {ONBOARDING_STEPS.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
              {isActive ? (
                <MarkOnboardedButton subscriptionId={subscription.id} />
              ) : (
                <p className="text-sm text-gray-500">Only an active subscription can be onboarded.</p>
              )}
            </>
          )}
        </Card>
      </div>

      <Card title="Work log">
        <div className="space-y-6">
          {isActive ? (
            <MaintenanceLogForm
              subscriptionId={subscription.id}
              today={workLog.today}
              earliest={workLog.earliest}
            />
          ) : null}
          {workLog.months.map((m) => (
            <WorkLogMonth key={m.month.toISOString()} {...m} />
          ))}
        </div>
      </Card>

      <Card title="Monthly reports">
        <div className="space-y-4">
          {!hasLastMonth && coversLastMonth && subscription.status !== "cancelled" ? (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-gray-400">
                The {lastMonthLabel} report is drafted on the 1st; start it now if it is missing.
              </p>
              <CreateReportDraftButton subscriptionId={subscription.id} monthLabel={lastMonthLabel} />
            </div>
          ) : null}
          {reports.items.length === 0 ? (
            <p className="text-sm text-gray-500">No reports yet.</p>
          ) : (
            reports.items.map((report) => (
              <ReportItem key={report.id} report={report} subscription={subscription} />
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
