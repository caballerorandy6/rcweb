"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import type { Milestone, MilestoneStatus } from "@/types/milestone";

type UpdateMilestoneResult =
  | { success: true; milestone: Milestone }
  | { success: false; message: string };

type UpdateMilestoneData = {
  title?: string;
  description?: string | null;
  status?: MilestoneStatus;
  completedAt?: Date | null;
};

export async function updateMilestoneAction(
  id: string,
  updateData: UpdateMilestoneData
): Promise<UpdateMilestoneResult> {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return { success: false, message: auth.error || "Unauthorized" };
  }

  try {
    // Get current milestone to check status change
    const currentMilestone = await prisma.milestone.findUnique({
      where: { id },
      select: { status: true },
    });

    const data = await prisma.milestone.update({
      where: { id },
      data: updateData,
      include: {
        payment: {
          select: {
            projectCode: true,
            name: true,
            email: true,
            accessToken: true,
          },
        },
      },
    });

    // Create notification if status changed to completed or in_progress
    if (
      updateData.status &&
      currentMilestone?.status !== updateData.status &&
      (updateData.status === "completed" || updateData.status === "in_progress")
    ) {
      await prisma.milestoneNotification.create({
        data: {
          milestoneId: data.id,
          type: updateData.status === "completed" ? "completed" : "started",
          projectCode: data.payment.projectCode,
          clientName: data.payment.name,
          clientEmail: data.payment.email,
          milestoneTitle: data.title,
          accessToken: data.payment.accessToken,
        },
      });
    }

    const milestone: Milestone = {
      id: data.id,
      paymentId: data.paymentId,
      title: data.title,
      description: data.description,
      order: data.order,
      status: data.status,
      dueDate: data.dueDate?.toISOString() ?? null,
      completedAt: data.completedAt?.toISOString() ?? null,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
    };

    return { success: true, milestone };
  } catch (error) {
    console.error("Error updating milestone:", error);
    return { success: false, message: "Failed to update milestone" };
  }
}
