import { beforeEach, describe, expect, it, vi } from "vitest";

// vi.mock is hoisted above the imports, so the mocks it uses must be too
const { db, generateInvoiceNumber, uploadInvoicePDF, deleteInvoicePDF } = vi.hoisted(() => ({
  db: { create: vi.fn(), findUnique: vi.fn() },
  generateInvoiceNumber: vi.fn(),
  uploadInvoicePDF: vi.fn(),
  deleteInvoicePDF: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({ prisma: { invoice: db } }));
vi.mock("./generateInvoiceNumber", () => ({ generateInvoiceNumber }));
vi.mock("../blob", () => ({ uploadInvoicePDF, deleteInvoicePDF }));

import { InvoiceAlreadyExistsError, saveInvoice } from "./saveInvoice";

const uniqueViolation = Object.assign(new Error("Unique constraint failed"), { code: "P2002" });

const render = vi.fn(async (invoiceNumber: string) => Buffer.from(`pdf of ${invoiceNumber}`));
const row = (invoiceNumber: string) => ({ description: `row of ${invoiceNumber}` }) as never;
const save = () => saveInvoice({ projectId: "p1", type: "initial", render, row });

beforeEach(() => {
  vi.clearAllMocks();
  db.findUnique.mockResolvedValue(null);
  db.create.mockImplementation(async ({ data }) => ({ id: "inv-id", ...data }));
  uploadInvoicePDF.mockImplementation(async (fileName: string) => ({
    url: `https://blob.test/${fileName}`,
    pathname: `dev/invoices/${fileName}`,
  }));
  deleteInvoicePDF.mockResolvedValue(undefined);
});

describe("saveInvoice", () => {
  it("stores the row with the number, the PDF and the project", async () => {
    generateInvoiceNumber.mockResolvedValue("INV-2026-012");

    const result = await save();

    expect(result).toEqual({
      invoiceId: "inv-id",
      invoiceNumber: "INV-2026-012",
      pdfUrl: "https://blob.test/INV-2026-012.pdf",
      pdfBuffer: Buffer.from("pdf of INV-2026-012"),
    });
    expect(db.create).toHaveBeenCalledWith({
      data: {
        description: "row of INV-2026-012",
        projectId: "p1",
        type: "initial",
        invoiceNumber: "INV-2026-012",
        pdfUrl: "https://blob.test/INV-2026-012.pdf",
        pdfBlobKey: "dev/invoices/INV-2026-012.pdf",
      },
    });
    expect(deleteInvoicePDF).not.toHaveBeenCalled();
  });

  it("takes the next number when another invoice won the one it had", async () => {
    generateInvoiceNumber
      .mockResolvedValueOnce("INV-2026-012")
      .mockResolvedValueOnce("INV-2026-013");
    db.create.mockRejectedValueOnce(uniqueViolation);

    const result = await save();

    // The PDF prints its number, so it is rendered again for the new one
    expect(render).toHaveBeenNthCalledWith(1, "INV-2026-012");
    expect(render).toHaveBeenNthCalledWith(2, "INV-2026-013");
    expect(result.invoiceNumber).toBe("INV-2026-013");
    expect(result.pdfBuffer).toEqual(Buffer.from("pdf of INV-2026-013"));
    // The PDF of the lost number does not stay behind
    expect(deleteInvoicePDF).toHaveBeenCalledExactlyOnceWith("https://blob.test/INV-2026-012.pdf");
  });

  it("does not render anything when the project already has that invoice", async () => {
    const existing = { id: "first", invoiceNumber: "INV-2026-011", pdfUrl: "https://blob.test/a.pdf" };
    db.findUnique.mockResolvedValue(existing);

    const error = await save().catch((e) => e);

    expect(error).toBeInstanceOf(InvoiceAlreadyExistsError);
    expect(error.existing).toBe(existing);
    expect(db.findUnique).toHaveBeenCalledWith({
      where: { projectId_type: { projectId: "p1", type: "initial" } },
    });
    expect(render).not.toHaveBeenCalled();
    expect(db.create).not.toHaveBeenCalled();
  });

  it("gives way when a simultaneous delivery saved the same invoice first", async () => {
    const existing = { id: "first", invoiceNumber: "INV-2026-012", pdfUrl: "https://blob.test/a.pdf" };
    generateInvoiceNumber.mockResolvedValue("INV-2026-012");
    db.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(existing);
    db.create.mockRejectedValueOnce(uniqueViolation);

    const error = await save().catch((e) => e);

    expect(error).toBeInstanceOf(InvoiceAlreadyExistsError);
    expect(error.existing).toBe(existing);
    expect(db.create).toHaveBeenCalledTimes(1);
    expect(deleteInvoicePDF).toHaveBeenCalledExactlyOnceWith("https://blob.test/INV-2026-012.pdf");
  });

  it("removes the PDF and rethrows when the database fails for another reason", async () => {
    generateInvoiceNumber.mockResolvedValue("INV-2026-012");
    db.create.mockRejectedValueOnce(new Error("connection lost"));

    await expect(save()).rejects.toThrow("connection lost");
    expect(db.create).toHaveBeenCalledTimes(1);
    expect(deleteInvoicePDF).toHaveBeenCalledExactlyOnceWith("https://blob.test/INV-2026-012.pdf");
  });

  it("gives up after five numbers taken in a row", async () => {
    generateInvoiceNumber.mockResolvedValue("INV-2026-012");
    db.create.mockRejectedValue(uniqueViolation);

    await expect(save()).rejects.toThrow(/after 5 attempts/);
    expect(db.create).toHaveBeenCalledTimes(5);
    expect(deleteInvoicePDF).toHaveBeenCalledTimes(5);
  });
});
