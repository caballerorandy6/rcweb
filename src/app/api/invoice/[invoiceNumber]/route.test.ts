import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  getInvoiceByNumber: vi.fn(),
  auth: vi.fn(),
  readInvoicePDF: vi.fn(),
}));

vi.mock("@/lib/invoice/actions", () => ({ getInvoiceByNumber: mocks.getInvoiceByNumber }));
vi.mock("@/lib/auth", () => ({ auth: mocks.auth }));
vi.mock("@/lib/blob", () => ({ readInvoicePDF: mocks.readInvoicePDF }));

import { GET } from "./route";

const TOKEN = "3f0c7c1e-6a51-4f0e-9d0b-0f6f3f1c2a11";
const invoice = {
  invoiceNumber: "INV-2026-041",
  pdfUrl: "https://store.private.blob.vercel-storage.com/invoices/INV-2026-041-abc.pdf",
  pdfBlobKey: "invoices/INV-2026-041-abc.pdf",
  project: { accessToken: TOKEN },
};

function pdfStream(text: string): ReadableStream<Uint8Array> {
  return new Response(text).body!;
}

function call(invoiceNumber: string, query = "") {
  return GET(new NextRequest(`http://localhost/api/invoice/${invoiceNumber}${query}`), {
    params: Promise.resolve({ invoiceNumber }),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getInvoiceByNumber.mockResolvedValue(invoice);
  mocks.auth.mockResolvedValue(null);
  mocks.readInvoicePDF.mockResolvedValue({ stream: pdfStream("%PDF-1.7 test"), size: 13 });
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("GET /api/invoice/[invoiceNumber]", () => {
  it("serves the PDF to the customer who has the project token", async () => {
    const response = await call("INV-2026-041", `?token=${TOKEN}`);

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toBe('inline; filename="INV-2026-041.pdf"');
    expect(response.headers.get("Cache-Control")).toContain("no-store");
    expect(response.headers.get("X-Robots-Tag")).toContain("noindex");
    expect(await response.text()).toBe("%PDF-1.7 test");
    expect(mocks.readInvoicePDF).toHaveBeenCalledExactlyOnceWith("invoices/INV-2026-041-abc.pdf");
  });

  it("serves the PDF to a signed-in admin without a token", async () => {
    mocks.auth.mockResolvedValue({ user: { role: "ADMIN" } });

    const response = await call("INV-2026-041");

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("%PDF-1.7 test");
  });

  it("never redirects to the Blob URL", async () => {
    const response = await call("INV-2026-041", `?token=${TOKEN}`);

    expect(response.headers.get("Location")).toBeNull();
  });

  it.each([
    ["no token", ""],
    ["the token of another project", "?token=9b2d8f04-1c57-4e7a-8a53-5d7f0a3e6c22"],
    ["an empty token", "?token="],
  ])("rejects %s without reading the store", async (_name, query) => {
    const response = await call("INV-2026-041", query);

    expect(response.status).toBe(401);
    expect(mocks.readInvoicePDF).not.toHaveBeenCalled();
  });

  it("rejects a signed-in user who is not an admin", async () => {
    mocks.auth.mockResolvedValue({ user: { role: "USER" } });

    expect((await call("INV-2026-041")).status).toBe(401);
  });

  it("rejects a malformed number before touching the database", async () => {
    const response = await call("../../etc/passwd");

    expect(response.status).toBe(400);
    expect(mocks.getInvoiceByNumber).not.toHaveBeenCalled();
  });

  it("answers 404 for an invoice that does not exist", async () => {
    mocks.getInvoiceByNumber.mockResolvedValue(null);

    expect((await call("INV-2026-999", `?token=${TOKEN}`)).status).toBe(404);
  });

  it("answers 404 when the invoice has no PDF in the store", async () => {
    mocks.getInvoiceByNumber.mockResolvedValue({ ...invoice, pdfBlobKey: null });
    expect((await call("INV-2026-041", `?token=${TOKEN}`)).status).toBe(404);
    expect(mocks.readInvoicePDF).not.toHaveBeenCalled();

    mocks.getInvoiceByNumber.mockResolvedValue(invoice);
    mocks.readInvoicePDF.mockResolvedValue(null);
    expect((await call("INV-2026-041", `?token=${TOKEN}`)).status).toBe(404);
  });

  it("hides the reason when the store fails", async () => {
    mocks.readInvoicePDF.mockRejectedValue(new Error("store_Y31 403 forbidden"));

    const response = await call("INV-2026-041", `?token=${TOKEN}`);

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Failed to fetch invoice" });
  });
});
