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
      paidDate: new Date(),
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
        paymentId: data.paymentId,
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
        stripeSessionId: data.stripeSessionId,
        status: "paid",
        issueDate: new Date(),
        dueDate: new Date(),
        paidDate: new Date(),
      },
    });

    console.log(`✅ Invoice created: ${invoiceNumber} (${data.type})`);

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
  paymentId: string
): Promise<{ invoiceId: string; invoiceNumber: string; pdfUrl: string }> {
  try {
    // 1. Obtener el payment completo
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error(`Payment not found: ${paymentId}`);
    }

    if (!payment.firstPaid || !payment.secondPaid) {
      throw new Error(
        "Cannot create summary invoice: payment not completed"
      );
    }

    // 2. Generar número de invoice único
    const invoiceNumber = await generateInvoiceNumber();

    // 3. Calcular impuestos sobre el total (ya incluidos en firstPayment y secondPayment)
    // Asumimos que los montos YA incluyen impuestos
    const subtotalBeforeTax = Math.round(payment.totalAmount / (1 + DEFAULT_TAX_RATE / 100));
    const taxAmount = payment.totalAmount - subtotalBeforeTax;

    // 4. Preparar datos del invoice summary
    const invoiceSummaryData: InvoiceSummaryData = {
      invoiceNumber,
      type: "summary",
      customerName: payment.name,
      customerEmail: payment.email,
      projectCode: payment.projectCode,
      planName: payment.planName,
      items: [
        {
          description: `Initial Payment - 50% Deposit for ${payment.planName}`,
          amount: payment.firstPayment,
          paidDate: payment.firstPaidAt!,
        },
        {
          description: `Final Payment - 50% Balance for ${payment.planName}`,
          amount: payment.secondPayment,
          paidDate: payment.secondPaidAt!,
        },
      ],
      subtotal: subtotalBeforeTax,
      taxRate: DEFAULT_TAX_RATE,
      taxAmount,
      total: payment.totalAmount,
      currency: "USD",
      status: "paid",
      issueDate: new Date(),
      paidDate: payment.secondPaidAt!,
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
        paymentId: payment.id,
        type: "summary",
        customerName: payment.name,
        customerEmail: payment.email,
        projectCode: payment.projectCode,
        planName: payment.planName,
        description: `Complete Project Summary - ${payment.planName}`,
        subtotal: subtotalBeforeTax,
        taxRate: DEFAULT_TAX_RATE,
        taxAmount,
        total: payment.totalAmount,
        currency: "USD",
        pdfUrl,
        pdfBlobKey,
        status: "paid",
        issueDate: new Date(),
        paidDate: payment.secondPaidAt,
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
 * Obtiene un invoice por su ID
 */
export async function getInvoiceById(invoiceId: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        payment: true,
      },
    });

    return invoice;
  } catch (error) {
    console.error("Error getting invoice:", error);
    throw new Error(
      `Failed to get invoice: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Obtiene todos los invoices de un payment
 */
export async function getInvoicesByPaymentId(paymentId: string) {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { paymentId },
      orderBy: { createdAt: "asc" },
    });

    return invoices;
  } catch (error) {
    console.error("Error getting invoices by payment:", error);
    throw new Error(
      `Failed to get invoices: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Obtiene un invoice por su número
 */
export async function getInvoiceByNumber(invoiceNumber: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { invoiceNumber },
      include: {
        payment: true,
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

/**
 * Genera invoices retroactivamente para un pago existente
 * Útil para pagos que se completaron antes de implementar el sistema de invoices
 */
export async function generateInvoicesForPayment(projectCode: string) {
  try {
        // 1. Buscar el pago
    const payment = await prisma.payment.findUnique({
      where: { projectCode },
    });

    if (!payment) {
      throw new Error(`Payment not found with code: ${projectCode}`);
    }

        type InvoiceResult =
      | { type: string; success: true; invoice: { invoiceId: string; invoiceNumber: string; pdfUrl: string } }
      | { type: string; success: false; error: string };

    const results: InvoiceResult[] = [];

    // 2. Verificar si ya existen invoices
    const existingInvoices = await prisma.invoice.findMany({
      where: { paymentId: payment.id },
    });

    if (existingInvoices.length > 0) {
            return {
        success: false,
        error: `Ya existen ${existingInvoices.length} invoices para este pago`,
        existingInvoices: existingInvoices.map(inv => ({
          number: inv.invoiceNumber,
          type: inv.type,
          amount: inv.total,
        })),
      };
    }

    // 3. Crear invoice inicial (si el primer pago está completado)
    if (payment.firstPaid) {
      try {
                const initialInvoice = await createInvoice({
          paymentId: payment.id,
          type: 'initial',
          customerName: payment.name,
          customerEmail: payment.email,
          projectCode: payment.projectCode,
          planName: payment.planName,
          description: `Initial Payment - 50% Deposit for ${payment.planName}`,
          subtotal: payment.firstPayment,
          taxRate: DEFAULT_TAX_RATE,
          stripeSessionId: payment.firstSessionId || undefined,
        });
        results.push({ type: 'initial', success: true, invoice: initialInvoice });
              } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error('❌ Error creando invoice inicial:', errorMsg);
        results.push({ type: 'initial', success: false, error: errorMsg });
      }
    }

    // 4. Crear invoice final (si el segundo pago está completado)
    if (payment.secondPaid) {
      try {
                const finalInvoice = await createInvoice({
          paymentId: payment.id,
          type: 'final',
          customerName: payment.name,
          customerEmail: payment.email,
          projectCode: payment.projectCode,
          planName: payment.planName,
          description: `Final Payment - 50% Balance for ${payment.planName}`,
          subtotal: payment.secondPayment,
          taxRate: DEFAULT_TAX_RATE,
          stripeSessionId: payment.secondSessionId || undefined,
        });
        results.push({ type: 'final', success: true, invoice: finalInvoice });
              } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error('❌ Error creando invoice final:', errorMsg);
        results.push({ type: 'final', success: false, error: errorMsg });
      }

      // 5. Crear invoice summary (solo si ambos pagos están completados)
      try {
                const summaryInvoice = await createInvoiceSummary(payment.id);
        results.push({ type: 'summary', success: true, invoice: summaryInvoice });
              } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error('❌ Error creando invoice summary:', errorMsg);
        results.push({ type: 'summary', success: false, error: errorMsg });
      }
    }

        return {
      success: true,
      payment: {
        projectCode: payment.projectCode,
        email: payment.email,
        firstPaid: payment.firstPaid,
        secondPaid: payment.secondPaid,
      },
      results,
    };
  } catch (error) {
    console.error('❌ Error generando invoices:', error);
    throw new Error(
      `Failed to generate invoices: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
