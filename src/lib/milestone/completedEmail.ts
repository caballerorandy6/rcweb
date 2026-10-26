import type { MilestoneStatus } from "@/generated/prisma/enums";
import { getProjectUrl } from "@/lib/projectUrl";

type ProjectLike = {
  name: string;
  projectCode: string;
  planName: string;
  accessToken: string;
};

type MilestoneLike = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  status: MilestoneStatus;
  completedAt: Date | null;
};

export type MilestoneCompletedEmailData = {
  customerName: string;
  projectCode: string;
  planName: string;
  milestoneTitle: string;
  milestoneDescription: string | null;
  completedAt: Date;
  completedCount: number;
  totalCount: number;
  /** Every milestone of the project, in order, so the customer sees where things stand */
  milestones: { title: string; status: MilestoneStatus }[];
  /** Link to /project/[accessToken] */
  projectUrl: string;
};

export type BuildMilestoneCompletedEmailResult =
  | { ok: true; data: MilestoneCompletedEmailData }
  | { ok: false; error: string };

/**
 * Everything the "milestone completed" email needs, derived from the project
 * and all of its milestones. Only a completed milestone can be announced.
 */
export function buildMilestoneCompletedEmail(
  project: ProjectLike,
  milestones: MilestoneLike[],
  milestoneId: string
): BuildMilestoneCompletedEmailResult {
  const milestone = milestones.find((m) => m.id === milestoneId);
  if (!milestone) {
    return { ok: false, error: "Milestone not found" };
  }
  if (milestone.status !== "completed") {
    return { ok: false, error: "Only completed milestones are announced to the customer" };
  }

  const ordered = milestones.toSorted((a, b) => a.order - b.order);

  return {
    ok: true,
    data: {
      customerName: project.name,
      projectCode: project.projectCode,
      planName: project.planName,
      milestoneTitle: milestone.title,
      milestoneDescription: milestone.description,
      completedAt: milestone.completedAt ?? new Date(),
      completedCount: ordered.filter((m) => m.status === "completed").length,
      totalCount: ordered.length,
      milestones: ordered.map((m) => ({ title: m.title, status: m.status })),
      projectUrl: getProjectUrl(project.accessToken),
    },
  };
}
