"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { syncSearchConsoleAction } from "@/actions/stats/syncSearchConsoleAction";

interface SyncSearchConsoleButtonProps {
  disabled?: boolean;
  /** Días a sincronizar; por defecto los de «Sync now» */
  days?: number;
  label?: string;
}

export default function SyncSearchConsoleButton({
  disabled = false,
  days,
  label = "Sync now",
}: SyncSearchConsoleButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await syncSearchConsoleAction(days);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      const { days: syncedDays, queries, pages, startDate, endDate } = result.data;
      toast.success(
        `Synced ${syncedDays} days with data (${startDate} → ${endDate}), ${queries} queries, ${pages} pages.`
      );
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isPending}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border font-inter transition-colors bg-gray-700/40 text-gray-200 border-gray-600 hover:bg-gray-700/70 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ArrowPathIcon className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} aria-hidden="true" />
      {isPending ? "Syncing…" : label}
    </button>
  );
}
