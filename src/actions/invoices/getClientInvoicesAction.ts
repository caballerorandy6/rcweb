"use server";

import { prisma } from "@/lib/prisma";
import { requireClient } from "@/lib/authGuard";
import type { ClientInvoiceWithProject } from "@/types/client";
import type { ActionResult } from "@/types/common";

export async function getClientInvoicesAction(): Promise<
  ActionResult<{ invoices: ClientInvoiceWithProject[]; projects: { projectCode: string; planName: string }[] }>
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

    // Get all invoices for this client through their payments
    const invoices = await prisma.invoice.findMany({
      where: {
        payment: {
          clientId: clientId,
        },
      },
      include: {
        payment: {
          select: {
            projectCode: true,
            planName: true,
          },
        },
      },
      orderBy: { issueDate: "desc" },
    });

    // Get unique projects for filter dropdown
    const projects = await prisma.payment.findMany({
      where: {
        clientId: clientId,
      },
      select: {
        projectCode: true,
        planName: true,
      },
      distinct: ["projectCode"],
      orderBy: { projectCode: "asc" },
    });

    return {
      success: true,
      data: {
        invoices: invoices.map((invoice) => ({
          id: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          type: invoice.type,
          total: invoice.total,
          status: invoice.status,
          issueDate: invoice.issueDate.toISOString(),
          pdfUrl: invoice.pdfUrl,
          projectCode: invoice.payment.projectCode,
          planName: invoice.payment.planName,
        })),
        projects: projects.map((p) => ({
          projectCode: p.projectCode,
          planName: p.planName,
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching client invoices:", error);
    return { success: false, error: "Failed to fetch invoices" };
  }
}

