import type { Milestone as MilestoneRow } from "@/generated/prisma/client";
import type { Milestone } from "@/types/milestone";

/** Prisma row → serializable shape shared by the admin and the public progress page */
export function toMilestone(m: MilestoneRow): Milestone {
  return {
    id: m.id,
    projectId: m.projectId,
    title: m.title,
    description: m.description,
    order: m.order,
    status: m.status,
    dueDate: m.dueDate?.toISOString() ?? null,
    completedAt: m.completedAt?.toISOString() ?? null,
    notifiedAt: m.notifiedAt?.toISOString() ?? null,
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
  };
}
