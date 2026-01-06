"use server";

import { prisma } from "@/lib/prisma";
import type { AdminProject } from "@/types/project";
import type { ActionResult } from "@/types/common";

export async function getAllProjectsAction(): Promise<
  ActionResult<{ projects: AdminProject[] }>
> {
  try {
    const projects = await prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
    });
    return {
      success: true,
      data: {
        projects: projects.map((project) => ({
        id: project.id,
        projectCode: project.projectCode,
        email: project.email,
        name: project.name,
        planName: project.planName,
        totalAmount: project.totalAmount,
        firstPaid: project.firstPaid,
        secondPaid: project.secondPaid,
        projectStatus: project.projectStatus,
        createdAt: project.createdAt,
      })),
      },
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { success: false, error: "Failed to fetch projects" };
  }
}
