// lib/invoice/actions.ts

import { emailTranslator } from "@/lib/email/i18n";
import { prisma } from "@/lib/prisma";
import { generateInvoicePDF, generateInvoiceSummaryPDF } from "./generateInvoicePDF";
import {
  InvoiceAlreadyExistsError,
  saveInvoice,
  type CreatedInvoice,
} from "./saveInvoice";
import {
  CreateInvoiceData,
  InvoiceData,
  InvoiceSummaryData,
  calculateTotal,
  effectiveTaxRate,
} from "./types";
import { getProjectCharges, isPaid } from "@/lib/project/charges";

export type { CreatedInvoice };

/**
 * Crea un invoice individual (initial o final) y genera su PDF
 */
export async function createInvoice(
  data: CreateInvoiceData
): Promise<CreatedInvoice> {
  try {
    // 1. Calcular impuestos y total
    const { taxAmount } = data;
    const taxRate = effectiveTaxRate(data.subtotal, taxAmount);
    const total = calculateTotal(data.subtotal, taxAmount);
    const issueDate = new Date();

    // 2. Numerar, generar el PDF, subirlo y guardar la fila
    return await saveInvoice({
      projectId: data.projectId,
      type: data.type,
      render: (invoiceNumber) => {
        const invoiceData: InvoiceData = {
          invoiceNumber,
          type: data.type,
          customerName: data.customerName,
          locale: data.locale,
          customerEmail: data.customerEmail,
          projectCode: data.projectCode,
          planName: data.planName,
          description: data.description,
          subtotal: data.subtotal,
          taxRate,
          taxAmount,
          total,
          currency: "USD",
          status: "paid",
          issueDate,
          dueDate: issueDate, // Same as issue date for paid invoices
          paidDate: data.paidDate,
          paymentMethod: data.paymentMethod,
          stripeSessionId: data.stripeSessionId,
        };
        return generateInvoicePDF(invoiceData);
      },
      row: () => ({
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        projectCode: data.projectCode,
        planName: data.planName,
        description: data.description,
        subtotal: data.subtotal,
        taxRate,
        taxAmount,
        total,
        currency: "USD",
        paymentMethod: data.paymentMethod,
        stripeSessionId: data.stripeSessionId,
        status: "paid",
        issueDate,
        dueDate: issueDate,
        paidDate: data.paidDate,
      }),
    });
  } catch (error) {
    if (error instanceof InvoiceAlreadyExistsError) throw error;
    console.error("Error creating invoice:", error);
    throw new Error(
      `Failed to create invoice: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Crea un invoice summary (muestra ambos pagos) y genera su PDF
 */
export async function createInvoiceSummary(
  projectId: string
): Promise<CreatedInvoice> {
  try {
    // 1. Obtener el proyecto con sus dos cobros
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { payments: true },
    });

    if (!project) {
      throw new Error(`Project not found: ${projectId}`);
    }

    const { deposit, final } = getProjectCharges(project.payments);

    if (!isPaid(deposit) || !isPaid(final)) {
      throw new Error("Cannot create summary invoice: project not fully paid");
    }

    // Rows migrated from the old schema may be paid without a date
    const depositPaidAt = deposit.paidAt ?? deposit.updatedAt;
    const finalPaidAt = final.paidAt ?? final.updatedAt;

    const t = emailTranslator(project.locale);

    // 2. Totales de los dos cobros: `amount` no incluye impuesto
    const subtotal = deposit.amount + final.amount;
    const taxAmount = deposit.taxAmount + final.taxAmount;
    const taxRate = effectiveTaxRate(subtotal, taxAmount);
    const total = calculateTotal(subtotal, taxAmount);
    const issueDate = new Date();

    // 3. Numerar, generar el PDF, subirlo y guardar la fila
    return await saveInvoice({
      projectId: project.id,
      type: "summary",
      render: (invoiceNumber) => {
        const invoiceSummaryData: InvoiceSummaryData = {
          invoiceNumber,
          type: "summary",
          customerName: project.name,
          locale: project.locale,
          customerEmail: project.email,
          projectCode: project.projectCode,
          planName: project.planName,
          items: [
            {
              description: t("pdf.depositLine", { planName: project.planName }),
              amount: deposit.amount,
              paidDate: depositPaidAt,
              paymentMethod: deposit.method,
            },
            {
              description: t("pdf.finalLine", { planName: project.planName }),
              amount: final.amount,
              paidDate: finalPaidAt,
              paymentMethod: final.method,
            },
          ],
          subtotal,
          taxRate,
          taxAmount,
          total,
          currency: "USD",
          status: "paid",
          issueDate,
          paidDate: finalPaidAt,
          paymentMethod: final.method,
        };
        return generateInvoiceSummaryPDF(invoiceSummaryData);
      },
      row: () => ({
        customerName: project.name,
        customerEmail: project.email,
        projectCode: project.projectCode,
        planName: project.planName,
        description: t("pdf.summaryLine", { planName: project.planName }),
        subtotal,
        taxRate,
        taxAmount,
        total,
        currency: "USD",
        paymentMethod: final.method,
        status: "paid",
        issueDate,
        paidDate: finalPaidAt,
      }),
    });
  } catch (error) {
    if (error instanceof InvoiceAlreadyExistsError) throw error;
    console.error("Error creating invoice summary:", error);
    throw new Error(
      `Failed to create invoice summary: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Obtiene un invoice por su número, con el proyecto al que pertenece
 */
export async function getInvoiceByNumber(invoiceNumber: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { invoiceNumber },
      include: {
        project: true,
      },
    });

    return invoice;
  } catch (error) {
    console.error("Error getting invoice by number:", error);
    throw new Error(
      `Failed to get invoice: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
