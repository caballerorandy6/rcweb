"use server";

import { prisma } from "@/lib/prisma";
import type { Milestone } from "@/types/milestone";

type ProjectInfo = {
  projectCode: string;
  name: string;
  planName: string;
  projectStatus: string;
};

type GetPublicMilestonesResult =
  | { success: true; project: ProjectInfo; milestones: Milestone[] }
  | { success: false; message: string };

export async function getPublicMilestonesAction(
  accessToken: string
): Promise<GetPublicMilestonesResult> {
  if (!accessToken) {
    return { success: false, message: "Access token is required" };
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
      return { success: false, message: "Project not found" };
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
      project: {
        projectCode: payment.projectCode,
        name: payment.name,
        planName: payment.planName,
        projectStatus: payment.projectStatus,
      },
      milestones,
    };
  } catch (error) {
    console.error("Error fetching public milestones:", error);
    return { success: false, message: "Failed to fetch project data" };
  }
}
