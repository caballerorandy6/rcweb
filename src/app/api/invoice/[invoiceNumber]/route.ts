// app/api/invoice/[invoiceNumber]/route.ts
// API endpoint para descargar invoices por número

import { NextRequest, NextResponse } from "next/server";
import { getInvoiceByNumber } from "@/lib/invoice/actions";
import { validateApiKey } from "@/lib/apiAuth";
import { auth } from "@/lib/auth";

// Configuración para prevenir indexación
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/invoice/[invoiceNumber]
 * Descarga un invoice PDF por su número
 * Ejemplo: /api/invoice/INV-2025-001
 *
 * Security: Requires one of:
 * - Valid API key (for internal/admin access)
 * - Admin session
 * - Email query param matching invoice customer email
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ invoiceNumber: string }> }
) {
  try {
    const { invoiceNumber } = await context.params;

    // Validar formato del invoice number
    if (!invoiceNumber || !/^INV-\d{4}-\d{3}$/.test(invoiceNumber)) {
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

    // Option 1: Valid API key
    if (validateApiKey(request)) {
      authorized = true;
    }

    // Option 2: Admin session
    if (!authorized) {
      const session = await auth();
      if (session?.user?.role === "ADMIN") {
        authorized = true;
      }
    }

    // Option 3: Email verification (for customer access via email link)
    if (!authorized) {
      const email = request.nextUrl.searchParams.get("email");
      if (email && email.toLowerCase() === invoice.customerEmail.toLowerCase()) {
        authorized = true;
      }
    }

    if (!authorized) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid credentials or email mismatch" },
        { status: 401 }
      );
    }

    if (!invoice.pdfUrl) {
      return NextResponse.json(
        { error: "Invoice PDF not available" },
        { status: 404 }
      );
    }

    // Redirigir al PDF en Vercel Blob con headers de seguridad
    const response = NextResponse.redirect(invoice.pdfUrl);

    // Headers de seguridad para prevenir indexación y caching
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    response.headers.set("Pragma", "no-cache");

    return response;
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch invoice",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
