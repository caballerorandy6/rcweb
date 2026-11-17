import { beforeEach, describe, expect, it, vi } from "vitest";

// vi.mock is hoisted above the imports, so the mocks it uses must be too
const { findUnique, markChargePaid, recordChargeTax } = vi.hoisted(() => ({
  findUnique: vi.fn(),
  markChargePaid: vi.fn(),
  recordChargeTax: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({ prisma: { project: { findUnique } } }));
vi.mock("@/lib/authGuard", () => ({
  requireAdmin: vi.fn().mockResolvedValue({ authorized: true, userId: "admin" }),
}));
vi.mock("@/lib/project/markChargePaid", () => ({ markChargePaid }));
vi.mock("@/lib/tax/recordChargeTax", () => ({ recordChargeTax }));
vi.mock("@/lib/invoice/createInvoiceAndSendEmail", () => ({ createInvoiceAndSendEmail: vi.fn() }));
vi.mock("resend", () => ({ Resend: vi.fn() }));
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

import { recordManualPaymentAction } from "./recordManualPaymentAction";

const PROJECT_ID = "3f0c1b9e-6a55-4d0e-9f43-2b6a0c1d7e11";

const address = { line1: "1 Main St", city: "Houston", state: "TX", postalCode: "77002", country: "US" };

function project(deposit: string, final: string) {
  return {
    id: PROJECT_ID,
    projectCode: "QA0001",
    status: "in_progress",
    billingAddress: address,
    invoices: [],
    payments: [
      { id: "dep", kind: "deposit", status: deposit, amount: 100_000, taxAmount: 0 },
      { id: "fin", kind: "final", status: final, amount: 100_000, taxAmount: 0 },
    ],
  };
}

const input = { method: "zelle", paidOn: "2026-11-17", taxCents: 0 } as const;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("recordManualPaymentAction", () => {
  it("does not record a fully refunded charge as paid again", async () => {
    findUnique.mockResolvedValue(project("refunded", "pending"));

    const result = await recordManualPaymentAction(PROJECT_ID, { kind: "deposit", ...input });

    expect(result).toEqual({
      success: false,
      error: "That charge was refunded in full and cannot be recorded as paid again",
    });
    expect(markChargePaid).not.toHaveBeenCalled();
    expect(recordChargeTax).not.toHaveBeenCalled();
  });

  it("does not record the final payment of a project whose deposit was refunded", async () => {
    findUnique.mockResolvedValue(project("refunded", "pending"));

    const result = await recordManualPaymentAction(PROJECT_ID, { kind: "final", ...input });

    expect(result).toEqual({ success: false, error: "Record the deposit before the final payment" });
    expect(markChargePaid).not.toHaveBeenCalled();
  });

  it("does not record a charge that is already paid", async () => {
    findUnique.mockResolvedValue(project("paid", "pending"));

    const result = await recordManualPaymentAction(PROJECT_ID, { kind: "deposit", ...input });

    expect(result).toEqual({ success: false, error: "That charge is already paid" });
    expect(markChargePaid).not.toHaveBeenCalled();
  });
});
