import { beforeEach, describe, expect, it, vi } from "vitest";

// vi.mock is hoisted above the imports, so the mocks it uses must be too
const { calculateOffStripeTax, captureException } = vi.hoisted(() => ({
  calculateOffStripeTax: vi.fn(),
  captureException: vi.fn(),
}));

vi.mock("@/lib/tax/stripeTax", () => ({ calculateOffStripeTax }));
vi.mock("@sentry/nextjs", () => ({ captureException }));

import { zelleRequestAfterEdit } from "./zelleRequest";

const address = {
  line1: "1 Main St",
  city: "Houston",
  state: "TX",
  postalCode: "77002",
  country: "US",
};

const quote = (overrides: Record<string, unknown> = {}) => ({
  id: "q1",
  totalAmount: 200000,
  billingAddress: address as Record<string, string> | null,
  zelleTaxCalculationId: "taxcalc_old" as string | null,
  ...overrides,
});

const withdrawn = { zelleRequestedAt: null, zelleTaxCalculationId: null, zelleTaxAmount: null };

beforeEach(() => {
  vi.clearAllMocks();
  calculateOffStripeTax.mockResolvedValue({
    ok: true,
    tax: { calculationId: "taxcalc_new", taxAmount: 9900 },
  });
});

describe("zelleRequestAfterEdit", () => {
  it("changes nothing when the customer never asked for Zelle", async () => {
    const patch = await zelleRequestAfterEdit(quote({ zelleTaxCalculationId: null }), 300000);

    expect(patch).toEqual({});
    expect(calculateOffStripeTax).not.toHaveBeenCalled();
  });

  it("changes nothing when the total stays the same", async () => {
    const patch = await zelleRequestAfterEdit(quote(), 200000);

    expect(patch).toEqual({});
    expect(calculateOffStripeTax).not.toHaveBeenCalled();
  });

  it("calculates the tax again for the new deposit", async () => {
    const patch = await zelleRequestAfterEdit(quote(), 300000);

    expect(calculateOffStripeTax).toHaveBeenCalledWith({
      amount: 150000,
      kind: "deposit",
      address,
    });
    expect(patch).toEqual({ zelleTaxCalculationId: "taxcalc_new", zelleTaxAmount: 9900 });
  });

  it("withdraws the request when Stripe Tax cannot place the address", async () => {
    calculateOffStripeTax.mockResolvedValue({ ok: false, reason: "invalid_location" });

    expect(await zelleRequestAfterEdit(quote(), 300000)).toEqual(withdrawn);
  });

  it("withdraws the request when the stored address is unusable", async () => {
    const patch = await zelleRequestAfterEdit(quote({ billingAddress: null }), 300000);

    expect(patch).toEqual(withdrawn);
    expect(calculateOffStripeTax).not.toHaveBeenCalled();
  });

  it("withdraws the request and reports it when Stripe Tax fails", async () => {
    const failure = new Error("Stripe is down");
    calculateOffStripeTax.mockRejectedValue(failure);

    expect(await zelleRequestAfterEdit(quote(), 300000)).toEqual(withdrawn);
    expect(captureException).toHaveBeenCalledWith(failure, expect.objectContaining({ extra: { quoteId: "q1" } }));
  });
});
