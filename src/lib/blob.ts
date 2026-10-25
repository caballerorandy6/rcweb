// lib/blob.ts
// Configuración de Vercel Blob Storage para PDFs de invoices

import { put, del, list } from '@vercel/blob';

/**
 * Carpeta de las facturas dentro del store. Producción escribe en `invoices/`;
 * preview y local escriben en `<entorno>/invoices/` para que una prueba nunca
 * sobrescriba el PDF de una factura real (el store de Blob es uno solo).
 */
export function invoiceBlobPrefix(vercelEnv = process.env.VERCEL_ENV): string {
  return vercelEnv === 'production' ? 'invoices/' : `${vercelEnv || 'dev'}/invoices/`;
}

/**
 * Sube un PDF a Vercel Blob Storage
 * @param fileName - Nombre del archivo (ej: "INV-2025-001.pdf")
 * @param pdfBuffer - Buffer del PDF
 * @returns URL del archivo y key para futuras operaciones
 */
export async function uploadInvoicePDF(
  fileName: string,
  pdfBuffer: Buffer
): Promise<{ url: string; pathname: string }> {
  try {
    const blob = await put(`${invoiceBlobPrefix()}${fileName}`, pdfBuffer, {
      access: 'public',
      contentType: 'application/pdf',
      addRandomSuffix: false, // Mantener nombre exacto para fácil identificación
      allowOverwrite: true, // Permitir sobrescribir si el archivo ya existe
    });

    return {
      url: blob.url,
      pathname: blob.pathname,
    };
  } catch (error) {
    console.error('Error uploading PDF to Vercel Blob:', error);
    throw new Error(`Failed to upload invoice PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Elimina un PDF de Vercel Blob Storage
 * @param url - URL completa del archivo
 */
export async function deleteInvoicePDF(url: string): Promise<void> {
  try {
    await del(url);
      } catch (error) {
    console.error('Error deleting PDF from Vercel Blob:', error);
    throw new Error(`Failed to delete invoice PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Lista todos los invoices en Vercel Blob
 * @returns Lista de blobs
 */
export async function listInvoices() {
  try {
    const { blobs } = await list({
      prefix: invoiceBlobPrefix(),
    });
    return blobs;
  } catch (error) {
    console.error('Error listing invoices from Vercel Blob:', error);
    throw new Error(`Failed to list invoices: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Valida que las variables de entorno estén configuradas
 */
export function validateBlobConfig(): boolean {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('BLOB_READ_WRITE_TOKEN is not configured');
    return false;
  }
  return true;
}
