"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteMaintenanceLogAction } from "@/actions/subscriptions/deleteMaintenanceLogAction";

/** Deletes a work log entry after a second click to confirm */
export default function DeleteMaintenanceLogButton({ id, label }: { id: string; label: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={`Delete: ${label}`}
        className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
      >
        <TrashIcon className="w-4 h-4" aria-hidden="true" />
      </button>
    );
  }

  return (
    <span className="flex items-center gap-1">
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const result = await deleteMaintenanceLogAction({ id });
            if (!result.success) {
              toast.error(result.error);
              setConfirming(false);
              return;
            }
            toast.success("Entry deleted");
            router.refresh();
          });
        }}
        className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-sm hover:bg-red-500/30 transition-colors disabled:opacity-50"
      >
        {isPending ? "…" : "Delete"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors"
      >
        Keep
      </button>
    </span>
  );
}
