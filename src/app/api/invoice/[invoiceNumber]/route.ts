// app/api/invoice/[invoiceNumber]/route.ts
// API endpoint para descargar invoices por número

import { NextRequest, NextResponse } from "next/server";
import { getInvoiceByNumber } from "@/lib/invoice/actions";
import { validateInvoiceNumber } from "@/lib/invoice/generateInvoiceNumber";
import { auth } from "@/lib/auth";
import { readInvoicePDF } from "@/lib/blob";

// Configuración para prevenir indexación
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/invoice/[invoiceNumber]
 * Sirve el PDF de un invoice por su número (el store de Blob es privado)
 * Ejemplo: /api/invoice/INV-2025-001
 *
 * Security: Requires one of:
 * - Admin session
 * - token query param matching the project's accessToken (customer links)
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ invoiceNumber: string }> }
) {
  try {
    const { invoiceNumber } = await context.params;

    // Validar formato del invoice number
    if (!invoiceNumber || !validateInvoiceNumber(invoiceNumber)) {
      return NextResponse.json(
        { error: "Invalid invoice number format" },
        { status: 400 }
      );
    }

    // Buscar el invoice en la base de datos
    const invoice = await getInvoiceByNumber(invoiceNumber);

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    // Authorization check
    let authorized = false;

    // Option 1: Admin session
    const session = await auth();
    if (session?.user?.role === "ADMIN") {
      authorized = true;
    }

    // Option 2: accessToken del project (UUID no adivinable, para links de cliente).
    // El email plano no sirve como credencial: los números de invoice son
    // secuenciales y el email de un cliente no es secreto.
    if (!authorized) {
      const token = request.nextUrl.searchParams.get("token");
      if (token && invoice.project?.accessToken === token) {
        authorized = true;
      }
    }

    if (!authorized) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const notAvailable = () =>
      NextResponse.json({ error: "Invoice PDF not available" }, { status: 404 });

    if (!invoice.pdfBlobKey) return notAvailable();

    // The store is private: the PDF is read with the server's credentials and
    // streamed to whoever passed the check above
    const pdf = await readInvoicePDF(invoice.pdfBlobKey);
    if (!pdf) return notAvailable();

    return new Response(pdf.stream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(pdf.size),
        "Content-Disposition": `inline; filename="${invoice.invoiceNumber}.pdf"`,
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
        "Cache-Control": "no-store, no-cache, must-revalidate, private",
        Pragma: "no-cache",
      },
    });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    // The message stays in the logs: it can name tables or hosts
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 });
  }
}
