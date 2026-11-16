"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { sendMaintenanceReportAction } from "@/actions/subscriptions/sendMaintenanceReportAction";

/** Emails a draft report to the customer after a second click to confirm */
export default function SendMaintenanceReportButton({
  reportId,
  customerEmail,
  disabled,
}: {
  reportId: string;
  customerEmail: string;
  /** Unsaved changes: the email would go out with the old figures */
  disabled: boolean;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!confirming || disabled) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => setConfirming(true)}
        className="rounded-lg border border-gold/40 px-4 py-2 text-sm text-gold hover:bg-gold/10 transition-colors disabled:opacity-50"
      >
        Send report
      </button>
    );
  }

  return (
    <span className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-gray-300">Send to {customerEmail}?</span>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const result = await sendMaintenanceReportAction(reportId);
            if (!result.success) {
              toast.error(result.error);
              setConfirming(false);
              return;
            }
            toast.success("Report sent");
            router.refresh();
          });
        }}
        className="rounded-lg bg-gold px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gold/90 transition-colors disabled:opacity-50"
      >
        {isPending ? "Sending…" : "Send"}
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => setConfirming(false)}
        className="px-2 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
      >
        Cancel
      </button>
    </span>
  );
}
