"use server";

import { prisma } from "@/lib/prisma";
import type { AdminProject } from "@/types/project";
import type { ActionResult } from "@/types/common";
import { requireAdmin } from "@/lib/authGuard";

export async function getAllProjectsAction(): Promise<
  ActionResult<{ projects: AdminProject[] }>
> {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.authorized) {
      return { success: false, error: authCheck.error };
    }

    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: { payments: { select: { kind: true, status: true } } },
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
          depositPaid: project.payments.some(
            (p) => p.kind === "deposit" && p.status === "paid"
          ),
          finalPaid: project.payments.some(
            (p) => p.kind === "final" && p.status === "paid"
          ),
          status: project.status,
          createdAt: project.createdAt,
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { success: false, error: "Failed to fetch projects" };
  }
}
