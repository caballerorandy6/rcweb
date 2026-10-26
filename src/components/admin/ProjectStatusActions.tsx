"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRightIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { updateProjectStatusAction } from "@/actions/projects/updateProjectStatusAction";
import { resendPaymentLinkAction } from "@/actions/projects/resendPaymentLinkAction";
import {
  getNextProjectStatus,
  getNextProjectStatusLabel,
  PROJECT_STATUS_LABELS,
} from "@/lib/project/status";
import type { ProjectStatus } from "@/generated/prisma/enums";

type ProjectStatusActionsProps = {
  project: {
    id: string;
    projectCode: string;
    status: ProjectStatus;
    depositPaid: boolean;
    finalPaid: boolean;
  };
  /** Short labels for the list; the detail page uses the full ones */
  compact?: boolean;
};

const button =
  "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap";

/**
 * Moves a project to its next status and, while it waits for the balance,
 * lets the admin send the payment link again. Data comes from the Server
 * Component; after a change the route is refreshed instead of refetched.
 */
export default function ProjectStatusActions({ project, compact = false }: ProjectStatusActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [action, setAction] = useState<"advance" | "resend" | null>(null);

  const next = getNextProjectStatus(project.status, project);
  const awaitingBalance = project.status === "ready_for_payment" && !project.finalPaid;

  const advance = () => {
    if (!next) return;
    setAction("advance");
    startTransition(async () => {
      try {
        const result = await updateProjectStatusAction(project.projectCode, next);
        if (!result.success) {
          toast.error(result.error);
          return;
        }
        toast.success(`${project.projectCode} is now ${PROJECT_STATUS_LABELS[next].toLowerCase()}`);
        if (next === "ready_for_payment") {
          if (result.data.emailError) {
            toast.warning("Status updated, but the client email failed", {
              description: result.data.emailError,
            });
          } else {
            toast.info("Payment link emailed to the client");
          }
        }
        router.refresh();
      } finally {
        setAction(null);
      }
    });
  };

  const resend = () => {
    setAction("resend");
    startTransition(async () => {
      try {
        const result = await resendPaymentLinkAction(project.id);
        if (result.success) {
          toast.success("Payment link emailed to the client again");
        } else {
          toast.error(result.error);
        }
      } finally {
        setAction(null);
      }
    });
  };

  if (!next && !awaitingBalance) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {next ? (
        <button
          type="button"
          onClick={advance}
          disabled={isPending}
          className={`${button} bg-gold/10 text-gold border-gold/30 hover:bg-gold/20`}
        >
          <ArrowRightIcon className="w-4 h-4" aria-hidden="true" />
          {isPending && action === "advance" ? "Updating…" : getNextProjectStatusLabel(next, compact)}
        </button>
      ) : null}
      {awaitingBalance && !compact ? (
        <button
          type="button"
          onClick={resend}
          disabled={isPending}
          className={`${button} bg-gray-700/40 text-gray-200 border-gray-600 hover:bg-gray-700/70`}
        >
          <PaperAirplaneIcon className="w-4 h-4" aria-hidden="true" />
          {isPending && action === "resend" ? "Sending…" : "Resend payment link"}
        </button>
      ) : null}
    </div>
  );
}
