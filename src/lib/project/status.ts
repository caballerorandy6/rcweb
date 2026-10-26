import type { ProjectStatus } from "@/generated/prisma/enums";
import type { UpdateableProjectStatus } from "@/types/project";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  ready_for_payment: "Ready for payment",
  completed: "Completed",
};

/** Badge classes shared by the admin list and the detail page */
export const PROJECT_STATUS_CLASSES: Record<ProjectStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/40",
  in_progress: "bg-blue-500/10 text-blue-400 border-blue-500/40",
  ready_for_payment: "bg-orange-500/10 text-orange-400 border-orange-500/40",
  completed: "bg-green-500/10 text-green-400 border-green-500/40",
};

/**
 * The status the admin can move a project to next. The deposit must be paid
 * before work starts, and once the balance is paid the webhook owns the
 * status (it marks the project completed), so there is nothing left to do.
 */
export function getNextProjectStatus(
  status: ProjectStatus,
  charges: { depositPaid: boolean; finalPaid: boolean }
): UpdateableProjectStatus | null {
  if (!charges.depositPaid || charges.finalPaid) return null;
  switch (status) {
    case "pending":
      return "in_progress";
    case "in_progress":
      return "ready_for_payment";
    case "ready_for_payment":
      return "completed";
    default:
      return null;
  }
}

/** Button label for moving to `next`; `compact` for the list, full for the detail page */
export function getNextProjectStatusLabel(next: UpdateableProjectStatus, compact = false): string {
  switch (next) {
    case "in_progress":
      return compact ? "Start" : "Start project";
    case "ready_for_payment":
      return compact ? "Mark ready" : "Mark ready & email payment link";
    case "completed":
      return compact ? "Complete" : "Mark completed";
  }
}
