// lib/blob.ts
// Configuración de Vercel Blob Storage para PDFs de invoices

import { put, del, list } from '@vercel/blob';

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
    const blob = await put(`invoices/${fileName}`, pdfBuffer, {
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
      prefix: 'invoices/',
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
