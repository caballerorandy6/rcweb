// lib/invoice/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { generateInvoiceNumber } from "./generateInvoiceNumber";
import { generateInvoicePDF, generateInvoiceSummaryPDF } from "./generateInvoicePDF";
import { uploadInvoicePDF } from "../blob";
import {
  CreateInvoiceData,
  InvoiceData,
  InvoiceSummaryData,
  calculateTaxAmount,
  calculateTotal,
  DEFAULT_TAX_RATE,
} from "./types";
import { getProjectCharges, isPaid } from "@/lib/project/charges";

/**
 * Crea un invoice individual (initial o final) y genera su PDF
 */
export async function createInvoice(
  data: CreateInvoiceData
): Promise<{ invoiceId: string; invoiceNumber: string; pdfUrl: string }> {
  try {
    // 1. Generar número de invoice único
    const invoiceNumber = await generateInvoiceNumber();

    // 2. Calcular impuestos y total
    const taxAmount = calculateTaxAmount(data.subtotal, data.taxRate);
    const total = calculateTotal(data.subtotal, taxAmount);

    // 3. Preparar datos del invoice
    const invoiceData: InvoiceData = {
      invoiceNumber,
      type: data.type,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      projectCode: data.projectCode,
      planName: data.planName,
      description: data.description,
      subtotal: data.subtotal,
      taxRate: data.taxRate,
      taxAmount,
      total,
      currency: "USD",
      status: "paid",
      issueDate: new Date(),
      dueDate: new Date(), // Same as issue date for paid invoices
      paidDate: data.paidDate,
      paymentMethod: data.paymentMethod,
      stripeSessionId: data.stripeSessionId,
    };

    // 4. Generar PDF
    const pdfBuffer = await generateInvoicePDF(invoiceData);

    // 5. Subir PDF a Vercel Blob
    const fileName = `${invoiceNumber}.pdf`;
    const { url: pdfUrl, pathname: pdfBlobKey } = await uploadInvoicePDF(
      fileName,
      pdfBuffer
    );

    // 6. Guardar invoice en base de datos
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        projectId: data.projectId,
        type: data.type,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        projectCode: data.projectCode,
        planName: data.planName,
        description: data.description,
        subtotal: data.subtotal,
        taxRate: data.taxRate,
        taxAmount,
        total,
        currency: "USD",
        pdfUrl,
        pdfBlobKey,
        paymentMethod: data.paymentMethod,
        stripeSessionId: data.stripeSessionId,
        status: "paid",
        issueDate: new Date(),
        dueDate: new Date(),
        paidDate: data.paidDate,
      },
    });

    return {
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      pdfUrl: invoice.pdfUrl!,
    };
  } catch (error) {
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
): Promise<{ invoiceId: string; invoiceNumber: string; pdfUrl: string }> {
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

    // 2. Generar número de invoice único
    const invoiceNumber = await generateInvoiceNumber();

    // 3. Calcular impuestos sobre el total (ya incluidos en ambos cobros)
    // Asumimos que los montos YA incluyen impuestos
    const subtotalBeforeTax = Math.round(project.totalAmount / (1 + DEFAULT_TAX_RATE / 100));
    const taxAmount = project.totalAmount - subtotalBeforeTax;

    // 4. Preparar datos del invoice summary
    const invoiceSummaryData: InvoiceSummaryData = {
      invoiceNumber,
      type: "summary",
      customerName: project.name,
      customerEmail: project.email,
      projectCode: project.projectCode,
      planName: project.planName,
      items: [
        {
          description: `Initial Payment - 50% Deposit for ${project.planName}`,
          amount: deposit.amount,
          paidDate: depositPaidAt,
          paymentMethod: deposit.method,
        },
        {
          description: `Final Payment - 50% Balance for ${project.planName}`,
          amount: final.amount,
          paidDate: finalPaidAt,
          paymentMethod: final.method,
        },
      ],
      subtotal: subtotalBeforeTax,
      taxRate: DEFAULT_TAX_RATE,
      taxAmount,
      total: project.totalAmount,
      currency: "USD",
      status: "paid",
      issueDate: new Date(),
      paidDate: finalPaidAt,
      paymentMethod: final.method,
    };

    // 5. Generar PDF
    const pdfBuffer = await generateInvoiceSummaryPDF(invoiceSummaryData);

    // 6. Subir PDF a Vercel Blob
    const fileName = `${invoiceNumber}.pdf`;
    const { url: pdfUrl, pathname: pdfBlobKey } = await uploadInvoicePDF(
      fileName,
      pdfBuffer
    );

    // 7. Guardar invoice en base de datos
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        projectId: project.id,
        type: "summary",
        customerName: project.name,
        customerEmail: project.email,
        projectCode: project.projectCode,
        planName: project.planName,
        description: `Complete Project Summary - ${project.planName}`,
        subtotal: subtotalBeforeTax,
        taxRate: DEFAULT_TAX_RATE,
        taxAmount,
        total: project.totalAmount,
        currency: "USD",
        pdfUrl,
        pdfBlobKey,
        paymentMethod: final.method,
        status: "paid",
        issueDate: new Date(),
        paidDate: finalPaidAt,
      },
    });

    return {
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      pdfUrl: invoice.pdfUrl!,
    };
  } catch (error) {
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
