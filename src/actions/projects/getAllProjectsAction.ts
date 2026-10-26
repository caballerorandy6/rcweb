"use server";

import { prisma } from "@/lib/prisma";
import type { AdminProject } from "@/types/project";
import type { ActionResult } from "@/types/common";
import { requireAdmin } from "@/lib/authGuard";
import { PaymentKind } from "@/generated/prisma/enums";
import { isPaid } from "@/lib/project/charges";

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
            (p) => p.kind === PaymentKind.deposit && isPaid(p)
          ),
          finalPaid: project.payments.some(
            (p) => p.kind === PaymentKind.final && isPaid(p)
          ),
          status: project.status,
          createdAt: project.createdAt.toISOString(),
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { success: false, error: "Failed to fetch projects" };
  }
}
