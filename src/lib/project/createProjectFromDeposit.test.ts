import { afterEach, describe, expect, it, vi } from "vitest";

const { prisma, linkProjectToContact, markQuoteAccepted, createInvoiceAndSendEmail, captureException } =
  vi.hoisted(() => ({
    prisma: {
      project: { findUnique: vi.fn(), create: vi.fn(), findUniqueOrThrow: vi.fn() },
    },
    linkProjectToContact: vi.fn(async () => true),
    markQuoteAccepted: vi.fn(async () => true),
    createInvoiceAndSendEmail: vi.fn(async () => ({ invoiceId: "i", invoiceNumber: "INV-1", pdfUrl: "u" })),
    captureException: vi.fn(),
  }));

vi.mock("@/lib/prisma", () => ({ prisma }));
vi.mock("@sentry/nextjs", () => ({ captureException }));
vi.mock("@/lib/project/linkToContact", () => ({ linkProjectToContact }));
vi.mock("@/lib/quote/markQuoteAccepted", () => ({ markQuoteAccepted }));
vi.mock("@/lib/invoice/createInvoiceAndSendEmail", () => ({ createInvoiceAndSendEmail }));

import { createProjectFromDeposit, type DepositProjectInput } from "./createProjectFromDeposit";

const resend = {} as never;
const paidAt = new Date("2026-10-28T12:00:00Z");

const input: DepositProjectInput = {
  projectCode: "ABC123",
  customerEmail: "ana@example.com",
  customerName: "Ana",
  planName: "Website Redesign",
  totalAmount: 240000,
  firstPaymentAmount: 120000,
  secondPaymentAmount: 120000,
  deposit: { method: "zelle", paidAt },
  terms: { acceptedAt: paidAt, termsVersion: "2026-10-29", ipAddress: "1.2.3.4", userAgent: "ua" },
  quoteId: "quote-1",
};

const row = (overrides: Record<string, unknown> = {}) => ({
  id: "proj-1",
  projectCode: "ABC123",
  email: "ana@example.com",
  contactId: null,
  payments: [
    { id: "p1", kind: "deposit", status: "paid", method: "zelle", stripeSessionId: null },
    { id: "p2", kind: "final", status: "pending", method: "stripe", stripeSessionId: null },
  ],
  invoices: [],
  ...overrides,
});

afterEach(() => vi.clearAllMocks());

describe("createProjectFromDeposit", () => {
  it("creates the project with both charges and the terms, links lead and quote, emails the initial invoice", async () => {
    prisma.project.findUnique.mockResolvedValueOnce(null);
    prisma.project.create.mockResolvedValueOnce(row());

    const result = await createProjectFromDeposit(input, resend);

    expect(result.created).toBe(true);
    expect(result.emailErrors).toEqual([]);
    const data = prisma.project.create.mock.calls[0][0].data;
    expect(data.status).toBe("in_progress");
    expect(data.payments.create).toEqual([
      { kind: "deposit", amount: 120000, status: "paid", method: "zelle", paidAt, stripeSessionId: undefined },
      { kind: "final", amount: 120000 },
    ]);
    expect(data.termsAcceptance.create).toMatchObject({ acceptedAt: paidAt, termsVersion: "2026-10-29", plan: "Website Redesign" });
    expect(linkProjectToContact).toHaveBeenCalledWith(expect.objectContaining({ id: "proj-1" }));
    expect(markQuoteAccepted).toHaveBeenCalledWith("quote-1", "proj-1");
    expect(createInvoiceAndSendEmail).toHaveBeenCalledWith(expect.objectContaining({ type: "initial" }));
  });

  it("leaves out the terms record when the customer never accepted them in the app", async () => {
    prisma.project.findUnique.mockResolvedValueOnce(null);
    prisma.project.create.mockResolvedValueOnce(row());

    await createProjectFromDeposit({ ...input, terms: null, quoteId: undefined }, resend);

    const data = prisma.project.create.mock.calls[0][0].data;
    expect(data).not.toHaveProperty("termsAcceptance");
    expect(markQuoteAccepted).not.toHaveBeenCalled();
  });

  it("is idempotent: a retry of the same Stripe deposit returns the existing project and skips the invoice it already has", async () => {
    prisma.project.findUnique.mockResolvedValueOnce(
      row({
        payments: [
          { id: "p1", kind: "deposit", status: "paid", method: "stripe", stripeSessionId: "cs_1" },
          { id: "p2", kind: "final", status: "pending", method: "stripe", stripeSessionId: null },
        ],
        invoices: [{ type: "initial" }],
      })
    );

    const result = await createProjectFromDeposit(
      { ...input, deposit: { method: "stripe", paidAt, stripeSessionId: "cs_1" } },
      resend
    );

    expect(result.created).toBe(false);
    expect(prisma.project.create).not.toHaveBeenCalled();
    expect(createInvoiceAndSendEmail).not.toHaveBeenCalled();
  });

  it("refuses a code collision: same code, another Checkout Session", async () => {
    prisma.project.findUnique.mockResolvedValueOnce(
      row({
        payments: [
          { id: "p1", kind: "deposit", status: "paid", method: "stripe", stripeSessionId: "cs_other" },
          { id: "p2", kind: "final", status: "pending", method: "stripe", stripeSessionId: null },
        ],
      })
    );

    await expect(
      createProjectFromDeposit({ ...input, deposit: { method: "stripe", paidAt, stripeSessionId: "cs_1" } }, resend)
    ).rejects.toThrow(/already belongs to another Checkout Session/);
    expect(captureException).toHaveBeenCalled();
  });

  it("keeps the row that won when two deliveries race on the unique code", async () => {
    prisma.project.findUnique.mockResolvedValueOnce(null);
    prisma.project.create.mockRejectedValueOnce(Object.assign(new Error("unique"), { code: "P2002" }));
    prisma.project.findUniqueOrThrow.mockResolvedValueOnce(row());

    const result = await createProjectFromDeposit(input, resend);

    expect(result.created).toBe(false);
    expect(result.project.id).toBe("proj-1");
  });

  it("reports an invoice failure without undoing the project", async () => {
    prisma.project.findUnique.mockResolvedValueOnce(null);
    prisma.project.create.mockResolvedValueOnce(row());
    createInvoiceAndSendEmail.mockRejectedValueOnce(new Error("Resend down"));

    const result = await createProjectFromDeposit(input, resend);

    expect(result.created).toBe(true);
    expect(result.emailErrors).toEqual(["Error creating invoice: Resend down"]);
  });
});
