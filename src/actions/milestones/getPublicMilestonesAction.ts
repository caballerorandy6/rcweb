"use server";

import { prisma } from "@/lib/prisma";
import type { Milestone } from "@/types/milestone";
import type { ActionResult } from "@/types/common";

type ProjectInfo = {
  projectCode: string;
  name: string;
  planName: string;
  projectStatus: string;
};

export async function getPublicMilestonesAction(
  accessToken: string
): Promise<ActionResult<{ project: ProjectInfo; milestones: Milestone[] }>> {
  if (!accessToken) {
    return { success: false, error: "Access token is required" };
  }

  try {
    const payment = await prisma.payment.findUnique({
      where: { accessToken },
      include: {
        milestones: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!payment) {
      return { success: false, error: "Project not found" };
    }

    const milestones: Milestone[] = payment.milestones.map((m) => ({
      id: m.id,
      paymentId: m.paymentId,
      title: m.title,
      description: m.description,
      order: m.order,
      status: m.status,
      dueDate: m.dueDate?.toISOString() ?? null,
      completedAt: m.completedAt?.toISOString() ?? null,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
    }));

    return {
      success: true,
      data: {
        project: {
          projectCode: payment.projectCode,
          name: payment.name,
          planName: payment.planName,
          projectStatus: payment.projectStatus,
        },
        milestones,
      },
    };
  } catch (error) {
    console.error("Error fetching public milestones:", error);
    return { success: false, error: "Failed to fetch project data" };
  }
}
