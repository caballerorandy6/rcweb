"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { setGoogleReviewHiddenAction } from "@/actions/reviews/setGoogleReviewHiddenAction";

interface GoogleReviewVisibilityButtonProps {
  id: string;
  author: string;
  hidden: boolean;
}

/** Oculta o muestra una reseña en la web; el Server Component se refresca después. */
export default function GoogleReviewVisibilityButton({
  id,
  author,
  hidden,
}: GoogleReviewVisibilityButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const Icon = hidden ? EyeIcon : EyeSlashIcon;

  const handleClick = () => {
    startTransition(async () => {
      const result = await setGoogleReviewHiddenAction(id, !hidden);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(
        hidden ? `${author}'s review is back on the site` : `${author}'s review is hidden from the site`
      );
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={hidden ? `Show ${author}'s review on the site` : `Hide ${author}'s review from the site`}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border font-inter transition-colors bg-gray-700/40 text-gray-200 border-gray-600 hover:bg-gray-700/70 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
    >
      <Icon className="w-4 h-4" aria-hidden="true" />
      {isPending ? "Saving…" : hidden ? "Show" : "Hide"}
    </button>
  );
}
