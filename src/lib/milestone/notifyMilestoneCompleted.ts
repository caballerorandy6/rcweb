import { prisma } from "@/lib/prisma";
import { sendMilestoneCompletedEmail } from "@/lib/email/senders/sendMilestoneCompletedEmail";
import type { Milestone } from "@/types/milestone";
import { buildMilestoneCompletedEmail } from "./completedEmail";
import { toMilestone } from "./toMilestone";

export type NotifyMilestoneCompletedResult =
  | { success: true; milestone: Milestone }
  | { success: false; error: string };

/**
 * Emails the customer that a milestone is done (with the whole list, so they
 * see where the project stands) and records `notifiedAt`. The email goes
 * first: the milestone only counts as announced once the customer has it.
 */
export async function notifyMilestoneCompleted(
  milestoneId: string
): Promise<NotifyMilestoneCompletedResult> {
  const row = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    select: {
      project: {
        select: {
          name: true,
          email: true,
          projectCode: true,
          planName: true,
          accessToken: true,
          milestones: { orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!row) {
    return { success: false, error: "Milestone not found" };
  }

  const built = buildMilestoneCompletedEmail(row.project, row.project.milestones, milestoneId);
  if (!built.ok) {
    return { success: false, error: built.error };
  }

  const sent = await sendMilestoneCompletedEmail({
    customerEmail: row.project.email,
    ...built.data,
  });
  if (!sent.success) {
    return { success: false, error: sent.error ?? "Email could not be sent" };
  }

  const updated = await prisma.milestone.update({
    where: { id: milestoneId },
    data: { notifiedAt: new Date() },
  });

  return { success: true, milestone: toMilestone(updated) };
}
