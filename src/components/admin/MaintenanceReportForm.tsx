"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateMaintenanceReportAction } from "@/actions/subscriptions/updateMaintenanceReportAction";
import SendMaintenanceReportButton from "@/components/admin/SendMaintenanceReportButton";

export interface ReportFigures {
  errorsResolved: number | null;
  updatesApplied: number | null;
  backupsVerified: boolean | null;
  uptimePercent: number | null;
  visitors: number | null;
  pageViews: number | null;
  notes: string | null;
}

const input =
  "w-full bg-gray-900/60 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-hidden focus:border-gold font-inter text-sm";

/** Empty field = not reported this month */
function numberOrNull(value: FormDataEntryValue | null): number | null {
  const text = String(value ?? "").trim();
  return text === "" ? null : Number(text);
}

function NumberField({
  id,
  name,
  label,
  hint,
  defaultValue,
  step = 1,
  max,
}: {
  id: string;
  name: keyof ReportFigures;
  label: string;
  hint: string;
  defaultValue: number | null;
  step?: number;
  max?: number;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={`${id}-${name}`} className="block text-xs text-gray-300">
        {label} <span className="text-gray-500">· {hint}</span>
      </label>
      <input
        id={`${id}-${name}`}
        name={name}
        type="number"
        inputMode={step === 1 ? "numeric" : "decimal"}
        min={0}
        max={max}
        step={step}
        defaultValue={defaultValue ?? ""}
        className={input}
      />
    </div>
  );
}

/** The figures the admin types into a draft report; blank fields stay out of the email */
export default function MaintenanceReportForm({
  reportId,
  subscriptionId,
  customerEmail,
  figures,
  customerLanguage,
}: {
  reportId: string;
  subscriptionId: string;
  customerEmail: string;
  figures: ReportFigures;
  /** "Spanish": the notes go to the customer as written */
  customerLanguage: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // Preview and send read the saved figures, so both wait for a save
  const [dirty, setDirty] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const backups = String(data.get("backupsVerified"));
        startTransition(async () => {
          const result = await updateMaintenanceReportAction({
            id: reportId,
            errorsResolved: numberOrNull(data.get("errorsResolved")),
            updatesApplied: numberOrNull(data.get("updatesApplied")),
            backupsVerified: backups === "" ? null : backups === "yes",
            uptimePercent: numberOrNull(data.get("uptimePercent")),
            visitors: numberOrNull(data.get("visitors")),
            pageViews: numberOrNull(data.get("pageViews")),
            notes: String(data.get("notes") ?? ""),
          });
          if (!result.success) {
            toast.error(result.error);
            return;
          }
          toast.success("Report saved");
          setDirty(false);
          router.refresh();
        });
      }}
      onChange={() => setDirty(true)}
      className="space-y-4"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <NumberField id={reportId} name="errorsResolved" label="Errors resolved" hint="Sentry" defaultValue={figures.errorsResolved} />
        <NumberField id={reportId} name="updatesApplied" label="Updates applied" hint="Dependabot, security" defaultValue={figures.updatesApplied} />
        <div className="space-y-1">
          <label htmlFor={`${reportId}-backupsVerified`} className="block text-xs text-gray-300">
            Backups <span className="text-gray-500">· checked this month</span>
          </label>
          <select
            id={`${reportId}-backupsVerified`}
            name="backupsVerified"
            defaultValue={figures.backupsVerified === null ? "" : figures.backupsVerified ? "yes" : "no"}
            className={input}
          >
            <option value="">Not reported</option>
            <option value="yes">Verified</option>
            <option value="no">Not verified</option>
          </select>
        </div>
        <NumberField id={reportId} name="uptimePercent" label="Uptime %" hint="monitor" defaultValue={figures.uptimePercent} step={0.01} max={100} />
        <NumberField id={reportId} name="visitors" label="Visitors" hint="GA4 users" defaultValue={figures.visitors} />
        <NumberField id={reportId} name="pageViews" label="Page views" hint="GA4 views" defaultValue={figures.pageViews} />
      </div>
      <div className="space-y-1">
        <label htmlFor={`${reportId}-notes`} className="block text-xs text-gray-300">
          Notes for the customer <span className="text-gray-500">· write them in {customerLanguage}</span>
        </label>
        <textarea
          id={`${reportId}-notes`}
          name="notes"
          rows={3}
          maxLength={5000}
          defaultValue={figures.notes ?? ""}
          className={input}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gold/90 transition-colors disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save draft"}
        </button>
        {dirty ? (
          <p className="text-sm text-amber-400">Save the draft to preview or send it.</p>
        ) : (
          <a
            href={`/subscriptions/${subscriptionId}/reports/${reportId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gold hover:underline"
          >
            Preview email
          </a>
        )}
        <SendMaintenanceReportButton reportId={reportId} customerEmail={customerEmail} disabled={dirty || isPending} />
      </div>
    </form>
  );
}
