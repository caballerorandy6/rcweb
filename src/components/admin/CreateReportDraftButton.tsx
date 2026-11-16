"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createMaintenanceReportDraftAction } from "@/actions/subscriptions/createMaintenanceReportDraftAction";

/** Drafts last month's report by hand, for a customer the cron did not cover */
export default function CreateReportDraftButton({
  subscriptionId,
  monthLabel,
}: {
  subscriptionId: string;
  /** "October 2026" */
  monthLabel: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const result = await createMaintenanceReportDraftAction({ subscriptionId });
          if (!result.success) {
            toast.error(result.error);
            return;
          }
          toast.success(`${monthLabel} report drafted`);
          router.refresh();
        });
      }}
      className="rounded-lg border border-gold/40 px-3 py-1.5 text-sm text-gold hover:bg-gold/10 transition-colors disabled:opacity-50"
    >
      {isPending ? "Drafting…" : `Draft ${monthLabel} report`}
    </button>
  );
}
