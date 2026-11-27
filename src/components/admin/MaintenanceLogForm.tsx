"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addMaintenanceLogAction } from "@/actions/subscriptions/addMaintenanceLogAction";

const input =
  "w-full bg-gray-900/60 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-hidden focus:border-gold font-inter text-sm";

/** Adds one entry to a maintenance customer's work log */
export default function MaintenanceLogForm({
  subscriptionId,
  today,
  earliest,
}: {
  subscriptionId: string;
  /** YYYY-MM-DD in Houston, computed on the server so SSR and the browser agree */
  today: string;
  /** Oldest day the action accepts (YYYY-MM-DD): older months are not listed on the page */
  earliest: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        startTransition(async () => {
          const result = await addMaintenanceLogAction({
            subscriptionId,
            workedOn: String(data.get("workedOn")),
            minutes: Number(data.get("minutes")),
            description: String(data.get("description")),
          });
          if (!result.success) {
            toast.error(result.error);
            return;
          }
          form.reset();
          toast.success("Work logged");
          router.refresh();
        });
      }}
      className="grid gap-3 sm:grid-cols-[10rem_7rem_1fr_auto] sm:items-end"
    >
      <div className="space-y-1">
        <label htmlFor="log-date" className="block text-xs text-gray-300">
          Date
        </label>
        <input
          id="log-date"
          name="workedOn"
          type="date"
          required
          defaultValue={today}
          min={earliest}
          max={today}
          className={input}
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="log-minutes" className="block text-xs text-gray-300">
          Minutes
        </label>
        <input
          id="log-minutes"
          name="minutes"
          type="number"
          inputMode="numeric"
          required
          min={1}
          max={600}
          step={1}
          placeholder="30"
          className={input}
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="log-description" className="block text-xs text-gray-300">
          What was done
        </label>
        <input
          id="log-description"
          name="description"
          type="text"
          required
          maxLength={1000}
          placeholder="Updated the opening hours on the contact page"
          className={input}
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gold/90 transition-colors disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Log work"}
      </button>
    </form>
  );
}
