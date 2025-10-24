// lib/invoice/generateInvoicePDF.ts
// Genera PDFs de invoices usando react-pdf

import { renderToBuffer } from "@react-pdf/renderer";
import { InvoiceTemplate, InvoiceSummaryTemplate } from "./InvoiceTemplate";
import { InvoiceData, InvoiceSummaryData } from "./types";

/**
 * Genera un PDF buffer para un invoice individual (initial o final)
 */
export async function generateInvoicePDF(
  data: InvoiceData
): Promise<Buffer> {
  try {
    const buffer = await renderToBuffer(<InvoiceTemplate data={data} />);
    return buffer as Buffer;
  } catch (error) {
    console.error("Error generating invoice PDF:", error);
    throw new Error(
      `Failed to generate invoice PDF: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Genera un PDF buffer para un invoice summary (muestra ambos pagos)
 */
export async function generateInvoiceSummaryPDF(
  data: InvoiceSummaryData
): Promise<Buffer> {
  try {
    const buffer = await renderToBuffer(
      <InvoiceSummaryTemplate data={data} />
    );
    return buffer as Buffer;
  } catch (error) {
    console.error("Error generating invoice summary PDF:", error);
    throw new Error(
      `Failed to generate invoice summary PDF: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
