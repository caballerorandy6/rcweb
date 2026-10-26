"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import {
  CheckCircleIcon,
  ClockIcon,
  PencilIcon,
  PlayCircleIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import type { Milestone, MilestoneStatus } from "@/types/milestone";
import { createMilestoneAction } from "@/actions/milestones/createMilestoneAction";
import { updateMilestoneAction } from "@/actions/milestones/updateMilestoneAction";
import { deleteMilestoneAction } from "@/actions/milestones/deleteMilestoneAction";

type MilestoneManagerProps = {
  projectId: string;
  milestones: Milestone[];
};

const STATUS_CLASSES: Record<MilestoneStatus, string> = {
  pending: "border-gray-600/60",
  in_progress: "border-blue-500/40 bg-blue-500/5",
  completed: "border-green-500/40 bg-green-500/5",
};

const NEXT_STATUS: Record<MilestoneStatus, { status: MilestoneStatus; label: string } | null> = {
  pending: { status: "in_progress", label: "Start" },
  in_progress: { status: "completed", label: "Complete" },
  completed: null,
};

const iconButton =
  "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const input =
  "w-full bg-gray-900/60 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-hidden focus:border-gold font-inter text-sm";

function StatusIcon({ status }: { status: MilestoneStatus }) {
  if (status === "completed") return <CheckCircleIcon className="w-5 h-5 text-green-400" aria-hidden="true" />;
  if (status === "in_progress") return <PlayCircleIcon className="w-5 h-5 text-blue-400" aria-hidden="true" />;
  return <ClockIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />;
}

/**
 * Milestones of one project, edited in place on the project page. The list
 * comes from the Server Component; every change refreshes the route so the
 * admin and the public /project/{token} page read the same rows.
 */
export default function MilestoneManager({ projectId, milestones }: MilestoneManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const completedCount = milestones.filter((m) => m.status === "completed").length;
  const progressPercent =
    milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  const run = (work: () => Promise<{ success: true } | { success: false; error: string }>, done?: () => void) => {
    startTransition(async () => {
      const result = await work();
      if (result.success) {
        done?.();
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  const addMilestone = (formData: FormData) => {
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    if (!title) return;
    run(
      () => createMilestoneAction(projectId, title, description || null, milestones.length),
      () => setIsAdding(false)
    );
  };

  const setStatus = (milestone: Milestone, status: MilestoneStatus) =>
    run(() =>
      updateMilestoneAction(milestone.id, {
        status,
        completedAt: status === "completed" ? new Date() : null,
      })
    );

  const rename = (milestone: Milestone, title: string) => {
    const next = title.trim();
    if (!next || next === milestone.title) {
      setEditingId(null);
      return;
    }
    run(
      () => updateMilestoneAction(milestone.id, { title: next }),
      () => setEditingId(null)
    );
  };

  const remove = (milestone: Milestone) =>
    run(
      () => deleteMilestoneAction(milestone.id),
      () => setConfirmDeleteId(null)
    );

  return (
    <section
      aria-labelledby="milestones-heading"
      className="bg-linear-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-xl shadow-xl shadow-black/20 font-inter"
    >
      <div className="p-5 sm:p-6 border-b border-gray-700/50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="milestones-heading" className="text-2xl text-gold font-iceland">
            Milestones
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {milestones.length === 0
              ? "The customer sees these on the progress page"
              : `${completedCount}/${milestones.length} completed (${progressPercent}%)`}
          </p>
        </div>
        {!isAdding ? (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className={`${iconButton} bg-gold/10 text-gold border-gold/30 hover:bg-gold/20`}
          >
            <PlusIcon className="w-4 h-4" aria-hidden="true" />
            Add milestone
          </button>
        ) : null}
      </div>

      {milestones.length > 0 ? (
        <div className="px-5 sm:px-6 pt-4">
          <div
            role="progressbar"
            aria-label="Milestones completed"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercent}
            className="h-2 bg-gray-700 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-linear-to-r from-gold to-yellow-500 transition-[width] duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      ) : null}

      <ol className="p-5 sm:p-6 space-y-3">
        {milestones.length === 0 && !isAdding ? (
          <li className="text-center py-8 text-gray-400 text-sm">No milestones yet.</li>
        ) : null}

        {milestones.map((milestone, index) => {
          const next = NEXT_STATUS[milestone.status];
          return (
            <li
              key={milestone.id}
              className={`p-4 rounded-lg border ${STATUS_CLASSES[milestone.status]} transition-colors`}
            >
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  {editingId === milestone.id ? (
                    <input
                      type="text"
                      aria-label="Milestone title"
                      defaultValue={milestone.title}
                      onBlur={(e) => rename(milestone, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") rename(milestone, e.currentTarget.value);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      autoFocus
                      className={input}
                    />
                  ) : (
                    <h3 className="font-semibold text-white text-sm sm:text-base">{milestone.title}</h3>
                  )}
                  {milestone.description ? (
                    <p className="text-sm text-gray-400 mt-1">{milestone.description}</p>
                  ) : null}
                  {milestone.completedAt ? (
                    <p className="text-xs text-green-400 mt-1">Completed {formatDate(milestone.completedAt)}</p>
                  ) : null}
                </div>
                <StatusIcon status={milestone.status} />
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-700/50">
                {next ? (
                  <button
                    type="button"
                    onClick={() => setStatus(milestone, next.status)}
                    disabled={isPending}
                    className={`${iconButton} bg-gold/10 text-gold border-gold/30 hover:bg-gold/20`}
                  >
                    {next.label}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setEditingId(milestone.id)}
                  disabled={isPending}
                  className={`${iconButton} bg-gray-700/40 text-gray-200 border-gray-600 hover:bg-gray-700/70`}
                >
                  <PencilIcon className="w-4 h-4" aria-hidden="true" />
                  Rename
                </button>
                {confirmDeleteId === milestone.id ? (
                  <span className="flex flex-wrap items-center gap-2 text-xs text-gray-300 basis-full sm:basis-auto">
                    Delete this milestone?
                    <button
                      type="button"
                      onClick={() => remove(milestone)}
                      disabled={isPending}
                      className={`${iconButton} bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30`}
                    >
                      {isPending ? "Deleting…" : "Yes, delete"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      disabled={isPending}
                      className={`${iconButton} bg-gray-700/40 text-gray-300 border-gray-600`}
                    >
                      Keep
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(milestone.id)}
                    disabled={isPending}
                    className={`${iconButton} bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20`}
                  >
                    <TrashIcon className="w-4 h-4" aria-hidden="true" />
                    Delete
                  </button>
                )}
              </div>
            </li>
          );
        })}

        {isAdding ? (
          <li className="p-4 rounded-lg border border-gold/30 bg-gold/5">
            <form action={addMilestone} className="space-y-2">
              <label className="block">
                <span className="sr-only">Milestone title</span>
                <input name="title" type="text" required placeholder="Milestone title…" autoFocus className={input} />
              </label>
              <label className="block">
                <span className="sr-only">Description</span>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Description (optional)…"
                  className={`${input} resize-none`}
                />
              </label>
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isPending}
                  className={`${iconButton} bg-gold text-gray-900 border-gold hover:bg-gold/90`}
                >
                  {isPending ? "Adding…" : "Add milestone"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  disabled={isPending}
                  className={`${iconButton} bg-gray-700/40 text-gray-300 border-gray-600`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </li>
        ) : null}
      </ol>
    </section>
  );
}
