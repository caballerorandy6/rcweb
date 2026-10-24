"use server";

import { prisma } from "@/lib/prisma";
import type { Milestone } from "@/types/milestone";
import type { ProjectStatus } from "@/generated/prisma/enums";
import type { ActionResult } from "@/types/common";

type ProjectInfo = {
  projectCode: string;
  name: string;
  planName: string;
  status: ProjectStatus;
};

export async function getPublicMilestonesAction(
  accessToken: string
): Promise<ActionResult<{ project: ProjectInfo; milestones: Milestone[] }>> {
  if (!accessToken) {
    return { success: false, error: "Access token is required" };
  }

  try {
    const project = await prisma.project.findUnique({
      where: { accessToken },
      include: {
        milestones: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    const milestones: Milestone[] = project.milestones.map((m) => ({
      id: m.id,
      projectId: m.projectId,
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
          projectCode: project.projectCode,
          name: project.name,
          planName: project.planName,
          status: project.status,
        },
        milestones,
      },
    };
  } catch (error) {
    console.error("Error fetching public milestones:", error);
    return { success: false, error: "Failed to fetch project data" };
  }
}
