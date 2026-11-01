import { afterEach, describe, expect, it, vi } from "vitest";

const { createInvoice, createInvoiceSummary, sendInvoiceEmail } = vi.hoisted(() => ({
  createInvoice: vi.fn(async () => ({ invoiceId: "i", invoiceNumber: "INV-1", pdfUrl: "https://x.test/a.pdf" })),
  createInvoiceSummary: vi.fn(async () => ({ invoiceId: "i", invoiceNumber: "INV-2", pdfUrl: "https://x.test/a.pdf" })),
  sendInvoiceEmail: vi.fn(async () => ({ success: true })),
}));

vi.mock("./actions", () => ({ createInvoice, createInvoiceSummary }));
vi.mock("@/lib/email/senders", () => ({ sendInvoiceEmail }));

import { createInvoiceAndSendEmail } from "./createInvoiceAndSendEmail";

const project = {
  id: "p1",
  name: "Ana",
  email: "ana@example.com",
  locale: "es",
  projectCode: "ABC123",
  planName: "Plan X",
  accessToken: "token",
  totalAmount: 100000,
  payments: [
    { kind: "deposit", amount: 50000, taxAmount: 3300, method: "stripe", status: "paid", paidAt: new Date() },
    { kind: "final", amount: 50000, taxAmount: 3300, method: "stripe", status: "paid", paidAt: new Date() },
  ],
} as never;

afterEach(() => vi.clearAllMocks());

describe("createInvoiceAndSendEmail", () => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(new ArrayBuffer(1))));

  it("invoices the tax Stripe actually charged", async () => {
    await createInvoiceAndSendEmail({ project, type: "initial", resend: {} as never });

    expect(createInvoice).toHaveBeenCalledWith(
      expect.objectContaining({ subtotal: 50000, taxAmount: 3300 })
    );
    expect(sendInvoiceEmail).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ firstPayment: 50000, depositTax: 3300, secondPayment: 50000, totalAmount: 100000 })
    );
  });

  it("states what was paid, tax included, on the final and summary emails", async () => {
    await createInvoiceAndSendEmail({ project, type: "final", resend: {} as never });
    expect(sendInvoiceEmail).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ secondPayment: 53300 })
    );

    await createInvoiceAndSendEmail({ project, type: "summary", resend: {} as never });
    expect(sendInvoiceEmail).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({ totalAmount: 106600 })
    );
  });
});
