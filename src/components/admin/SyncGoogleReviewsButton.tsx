"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { syncGoogleReviewsAction } from "@/actions/reviews/syncGoogleReviewsAction";

export default function SyncGoogleReviewsButton({ disabled = false }: { disabled?: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await syncGoogleReviewsAction();
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      const { totalReviewCount, averageRating, stored, removed } = result.data;
      toast.success(
        `Synced: ${averageRating.toFixed(1)} stars, ${totalReviewCount} reviews on Google (${stored} stored${removed ? `, ${removed} removed` : ""}).`
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
      {isPending ? "Syncing…" : "Sync now"}
    </button>
  );
}
