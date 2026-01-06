"use server";

import { prisma } from "@/lib/prisma";
import { requireClient } from "@/lib/authGuard";
import type { ClientProject } from "@/types/client";
import type { ActionResult } from "@/types/common";

export async function getClientProjectsAction(): Promise<
  ActionResult<{ projects: ClientProject[] }>
> {
  try {
    const authResult = await requireClient();

    if (!authResult.authorized) {
      return {
        success: false,
        error: authResult.error,
      };
    }

    const clientId = authResult.userId;

    const projects = await prisma.payment.findMany({
      where: {
        clientId: clientId,
      },
      include: {
        invoices: {
          orderBy: { issueDate: "desc" },
          take: 5, // Últimas 5 facturas
        },
        milestones: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: {
        projects: projects.map((project) => ({
          id: project.id,
          projectCode: project.projectCode,
          accessToken: project.accessToken,
          email: project.email,
          name: project.name,
          planName: project.planName,
          totalAmount: project.totalAmount,
          firstPayment: project.firstPayment,
          secondPayment: project.secondPayment,
          firstPaid: project.firstPaid,
          secondPaid: project.secondPaid,
          projectStatus: project.projectStatus,
          firstPaidAt: project.firstPaidAt?.toISOString() || null,
          secondPaidAt: project.secondPaidAt?.toISOString() || null,
          createdAt: project.createdAt.toISOString(),
          updatedAt: project.updatedAt.toISOString(),
          invoices: project.invoices.map((invoice) => ({
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            type: invoice.type,
            total: invoice.total,
            status: invoice.status,
            issueDate: invoice.issueDate.toISOString(),
            pdfUrl: invoice.pdfUrl,
          })),
          milestones: project.milestones.map((milestone) => ({
            id: milestone.id,
            title: milestone.title,
            description: milestone.description,
            status: milestone.status,
            order: milestone.order,
            dueDate: milestone.dueDate?.toISOString() || null,
            completedAt: milestone.completedAt?.toISOString() || null,
          })),
        })),
    };
  } catch (error) {
    console.error("Error fetching client projects:", error);
    return { success: false, error: "Failed to fetch projects" };
  }
}
