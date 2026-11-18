// lib/blob.ts
// Invoice PDFs in a private Vercel Blob store

import { put, del, get } from '@vercel/blob';

/**
 * Invoices live in private stores: `rcweb-invoices` for production and
 * `rcweb-invoices-dev` for preview and local work. A PDF is only readable
 * with the store credentials, so customers and the admin get it through
 * `/api/invoice/[invoiceNumber]`, never from a Blob URL.
 */

/**
 * Carpeta de las facturas dentro del store. Producción escribe en `invoices/`;
 * preview y local escriben en `<entorno>/invoices/` para distinguir de dónde
 * salió cada PDF de prueba (comparten el store de desarrollo).
 */
export function invoiceBlobPrefix(vercelEnv = process.env.VERCEL_ENV): string {
  return vercelEnv === 'production' ? 'invoices/' : `${vercelEnv || 'dev'}/invoices/`;
}

type InvoiceStoreCredentials = { token: string } | { storeId: string };

/**
 * Which store the SDK talks to. A deployment on Vercel names the store and
 * authenticates with its short-lived OIDC token, in preview exactly as in
 * production; a machine outside Vercel has no such token and uses the
 * read-write token of the development store.
 *
 * Always explicit: without it the SDK would fall back to whatever
 * `BLOB_*` variables the project has.
 */
export function invoiceStoreCredentials(
  env: Record<string, string | undefined> = process.env
): InvoiceStoreCredentials {
  const storeId = env.INVOICES_STORE_ID?.trim();
  const token = env.INVOICES_READ_WRITE_TOKEN?.trim();

  if (env.VERCEL && storeId) return { storeId };
  if (token) return { token };
  if (storeId) return { storeId };

  throw new Error(
    'Invoice storage is not configured: set INVOICES_STORE_ID or INVOICES_READ_WRITE_TOKEN'
  );
}

/**
 * Sube un PDF al store privado
 * @param fileName - Nombre del archivo (ej: "INV-2025-001.pdf")
 * @param pdfBuffer - Buffer del PDF
 * @returns URL del blob (no accesible sin credenciales) y pathname para leerlo o borrarlo
 */
export async function uploadInvoicePDF(
  fileName: string,
  pdfBuffer: Buffer
): Promise<{ url: string; pathname: string }> {
  try {
    const blob = await put(`${invoiceBlobPrefix()}${fileName}`, pdfBuffer, {
      ...invoiceStoreCredentials(),
      access: 'private',
      contentType: 'application/pdf',
      // Dos facturas creadas a la vez pueden proponer el mismo número antes de
      // que la base de datos decida cuál se lo queda: con sufijo aleatorio
      // ninguna pisa el PDF de la otra
      addRandomSuffix: true,
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
 * Lee un PDF del store privado
 * @param pathname - `Invoice.pdfBlobKey`
 * @returns El stream del PDF y su tamaño, o `null` si el store no lo tiene
 */
export async function readInvoicePDF(
  pathname: string
): Promise<{ stream: ReadableStream<Uint8Array>; size: number } | null> {
  const result = await get(pathname, {
    ...invoiceStoreCredentials(),
    access: 'private',
  });

  if (!result || result.statusCode !== 200) return null;
  return { stream: result.stream, size: result.blob.size };
}

/**
 * Elimina un PDF del store privado
 * @param urlOrPathname - URL del blob o su pathname
 */
export async function deleteInvoicePDF(urlOrPathname: string): Promise<void> {
  try {
    await del(urlOrPathname, invoiceStoreCredentials());
  } catch (error) {
    console.error('Error deleting PDF from Vercel Blob:', error);
    throw new Error(`Failed to delete invoice PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
