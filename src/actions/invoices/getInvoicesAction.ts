"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import type { ActionResult } from "@/types/common";
import type { InvoiceStatus, InvoiceType } from "@/generated/prisma/enums";

export type AdminInvoice = {
  id: string;
  invoiceNumber: string;
  type: InvoiceType;
  status: InvoiceStatus;
  customerName: string;
  customerEmail: string;
  projectId: string;
  projectCode: string;
  planName: string;
  /** Cents */
  total: number;
  /** Cents */
  taxAmount: number;
  issueDate: Date;
  pdfUrl: string | null;
};

/** Every invoice, newest first, with just the columns the admin list shows */
export async function getInvoicesAction(): Promise<
  ActionResult<{ invoices: AdminInvoice[] }>
> {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.authorized) {
      return { success: false, error: authCheck.error };
    }

    const invoices = await prisma.invoice.findMany({
      orderBy: { issueDate: "desc" },
      select: {
        id: true,
        invoiceNumber: true,
        type: true,
        status: true,
        customerName: true,
        customerEmail: true,
        projectId: true,
        projectCode: true,
        planName: true,
        total: true,
        taxAmount: true,
        issueDate: true,
        pdfUrl: true,
      },
    });

    return { success: true, data: { invoices } };
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return { success: false, error: "Failed to fetch invoices" };
  }
}
