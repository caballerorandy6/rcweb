// lib/invoice/generateInvoiceNumber.ts
// Genera números únicos de invoice secuenciales

import { prisma } from "@/lib/prisma";

/**
 * Genera un número de invoice único y secuencial
 * Formato: INV-YYYY-NNN
 * Ejemplo: INV-2025-001, INV-2025-002, etc.
 *
 * Se reinicia la secuencia cada año.
 */
export async function generateInvoiceNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `INV-${currentYear}-`;

  try {
    // Buscar el último invoice del año actual
    const lastInvoice = await prisma.invoice.findFirst({
      where: {
        invoiceNumber: {
          startsWith: prefix,
        },
      },
      orderBy: {
        invoiceNumber: 'desc',
      },
    });

    let nextNumber = 1;

    if (lastInvoice) {
      // Extraer el número del último invoice
      // Ej: "INV-2025-042" -> "042" -> 42
      const lastNumberStr = lastInvoice.invoiceNumber.split('-')[2];
      const lastNumber = parseInt(lastNumberStr, 10);

      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    // Formatear con padding de 3 dígitos (001, 002, ..., 999)
    const formattedNumber = nextNumber.toString().padStart(3, '0');
    const invoiceNumber = `${prefix}${formattedNumber}`;

    // Verificar unicidad (por si acaso hay race conditions)
    const exists = await prisma.invoice.findUnique({
      where: { invoiceNumber },
    });

    if (exists) {
      // Si existe, intentar con el siguiente número
      console.warn(`Invoice number ${invoiceNumber} already exists, trying next...`);
      return generateInvoiceNumber(); // Recursión para obtener el siguiente
    }

    return invoiceNumber;
  } catch (error) {
    console.error('Error generating invoice number:', error);
    throw new Error(`Failed to generate invoice number: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Valida el formato de un número de invoice
 * @param invoiceNumber - Número de invoice a validar
 * @returns true si el formato es válido
 */
export function validateInvoiceNumber(invoiceNumber: string): boolean {
  // Formato: INV-YYYY-NNN
  const pattern = /^INV-\d{4}-\d{3}$/;
  return pattern.test(invoiceNumber);
}

/**
 * Extrae el año de un número de invoice
 * @param invoiceNumber - Número de invoice
 * @returns Año del invoice
 */
export function extractYearFromInvoiceNumber(invoiceNumber: string): number | null {
  if (!validateInvoiceNumber(invoiceNumber)) {
    return null;
  }

  const parts = invoiceNumber.split('-');
  return parseInt(parts[1], 10);
}

/**
 * Extrae el número secuencial de un invoice
 * @param invoiceNumber - Número de invoice
 * @returns Número secuencial
 */
export function extractSequenceFromInvoiceNumber(invoiceNumber: string): number | null {
  if (!validateInvoiceNumber(invoiceNumber)) {
    return null;
  }

  const parts = invoiceNumber.split('-');
  return parseInt(parts[2], 10);
}
