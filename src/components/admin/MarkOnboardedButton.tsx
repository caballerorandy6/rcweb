"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { markOnboardedAction } from "@/actions/subscriptions/markOnboardedAction";

/** Marks the maintenance onboarding done (monitoring, backups, access) */
export default function MarkOnboardedButton({ subscriptionId }: { subscriptionId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const result = await markOnboardedAction({ subscriptionId });
          if (result.success) {
            toast.success("Onboarding marked as done");
            router.refresh();
          } else {
            toast.error(result.error);
          }
        });
      }}
      className="rounded-lg bg-gold px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gold/90 transition-colors disabled:opacity-50"
    >
      {isPending ? "Saving…" : "Mark onboarded"}
    </button>
  );
}
