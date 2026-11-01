"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProjectLocaleAction } from "@/actions/projects/updateProjectLocaleAction";
import type { Locale } from "@/i18n/routing";

/** Language of the customer's future emails and invoices */
export default function ProjectLocaleSelect({
  projectId,
  locale,
}: {
  projectId: string;
  locale: Locale;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <label className="inline-flex items-center gap-1.5 text-xs text-gray-400">
      Customer language
      <select
        value={locale}
        disabled={isPending}
        onChange={(event) => {
          const next = event.target.value;
          startTransition(async () => {
            const result = await updateProjectLocaleAction({ projectId, locale: next });
            if (result.success) {
              toast.success("Language updated");
              router.refresh();
            } else {
              toast.error(result.error);
            }
          });
        }}
        className="rounded-lg border border-gray-700/60 bg-gray-800/80 px-2 py-1 text-xs text-white"
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>
    </label>
  );
}
