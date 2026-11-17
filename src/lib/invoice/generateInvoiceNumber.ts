// lib/invoice/generateInvoiceNumber.ts
// Sequential invoice numbers: INV-YYYY-NNN, restarting every year

import { prisma } from "@/lib/prisma";

/** INV-2026-001 … INV-2026-999, INV-2026-1000: three digits or more */
const INVOICE_NUMBER_PATTERN = /^INV-(\d{4})-(\d{3,})$/;

/**
 * The number after the highest one of that year. Compared as numbers: sorted
 * as text, "999" comes after "1000" and the sequence would stall there.
 */
export function nextInvoiceNumber(existing: string[], year: number): string {
  let highest = 0;
  for (const invoiceNumber of existing) {
    const match = INVOICE_NUMBER_PATTERN.exec(invoiceNumber);
    if (match && Number(match[1]) === year) {
      highest = Math.max(highest, Number(match[2]));
    }
  }
  return `INV-${year}-${String(highest + 1).padStart(3, "0")}`;
}

/**
 * Proposes the next invoice number of the current year. It reserves nothing:
 * two invoices created at once get the same proposal, and the unique
 * `invoiceNumber` decides who keeps it. Call it through saveInvoice(), which
 * asks for another number when it loses.
 */
export async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const invoices = await prisma.invoice.findMany({
    where: { invoiceNumber: { startsWith: `INV-${year}-` } },
    select: { invoiceNumber: true },
  });

  return nextInvoiceNumber(
    invoices.map((invoice) => invoice.invoiceNumber),
    year
  );
}

/** True for INV-YYYY-NNN (three digits or more) */
export function validateInvoiceNumber(invoiceNumber: string): boolean {
  return INVOICE_NUMBER_PATTERN.test(invoiceNumber);
}
