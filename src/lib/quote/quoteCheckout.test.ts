import { beforeEach, describe, expect, it, vi } from "vitest";

// vi.mock is hoisted above the imports, so the mocks it uses must be too
const { db, sessions, createInitialPaymentCheckout } = vi.hoisted(() => ({
  db: { updateMany: vi.fn(), findUniqueOrThrow: vi.fn() },
  sessions: { retrieve: vi.fn(), expire: vi.fn() },
  createInitialPaymentCheckout: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({ prisma: { quote: db } }));
vi.mock("@/lib/stripe", () => ({ default: { checkout: { sessions } } }));
vi.mock("@/lib/project/initialPaymentCheckout", () => ({ createInitialPaymentCheckout }));

import { claimQuoteForProject, expireQuoteCheckout, openQuoteCheckout, releaseQuoteClaim } from "./quoteCheckout";

const quote = (overrides: Record<string, unknown> = {}) => ({
  id: "q1",
  planName: "Business Website",
  totalAmount: 200000,
  name: "Ana",
  email: "ana@example.com",
  checkoutSessionId: null as string | null,
  ...overrides,
});

const session = (overrides: Record<string, unknown> = {}) => ({
  id: "cs_old",
  status: "open",
  url: "https://checkout.stripe.test/cs_old",
  metadata: { planName: "Business Website", totalAmount: "200000", customerEmail: "ana@example.com" },
  ...overrides,
});

const options = { description: "Quote Q-2026-001", cancelUrl: "https://site.test/quote/t", locale: "en" as const };

beforeEach(() => {
  vi.clearAllMocks();
  db.updateMany.mockResolvedValue({ count: 1 });
  sessions.expire.mockResolvedValue({});
  createInitialPaymentCheckout.mockResolvedValue({
    sessionUrl: "https://checkout.stripe.test/cs_new",
    sessionId: "cs_new",
    projectCode: "AB3K9Z",
  });
});

describe("openQuoteCheckout", () => {
  it("creates a session and remembers it on the quote", async () => {
    const result = await openQuoteCheckout(quote(), options);

    expect(result).toEqual({ kind: "open", sessionUrl: "https://checkout.stripe.test/cs_new" });
    expect(createInitialPaymentCheckout).toHaveBeenCalledWith({
      planName: "Business Website",
      totalAmount: 200000,
      customerName: "Ana",
      customerEmail: "ana@example.com",
      quoteId: "q1",
      ...options,
    });
    expect(db.updateMany).toHaveBeenCalledWith({
      where: { id: "q1", checkoutSessionId: null },
      data: { checkoutSessionId: "cs_new" },
    });
  });

  it("sends the customer back to the session that is still open", async () => {
    sessions.retrieve.mockResolvedValue(session());

    const result = await openQuoteCheckout(quote({ checkoutSessionId: "cs_old" }), options);

    expect(result).toEqual({ kind: "open", sessionUrl: "https://checkout.stripe.test/cs_old" });
    expect(createInitialPaymentCheckout).not.toHaveBeenCalled();
  });

  it("does not open another session when the last one was paid", async () => {
    sessions.retrieve.mockResolvedValue(session({ status: "complete", url: null }));

    const result = await openQuoteCheckout(quote({ checkoutSessionId: "cs_old" }), options);

    expect(result).toEqual({ kind: "paid" });
    expect(createInitialPaymentCheckout).not.toHaveBeenCalled();
  });

  it("replaces an open session whose amount no longer matches the quote", async () => {
    sessions.retrieve.mockResolvedValue(session());

    const result = await openQuoteCheckout(
      quote({ checkoutSessionId: "cs_old", totalAmount: 300000 }),
      options
    );

    expect(sessions.expire).toHaveBeenCalledWith("cs_old");
    expect(result).toEqual({ kind: "open", sessionUrl: "https://checkout.stripe.test/cs_new" });
    expect(db.updateMany).toHaveBeenCalledWith({
      where: { id: "q1", checkoutSessionId: "cs_old" },
      data: { checkoutSessionId: "cs_new" },
    });
  });

  it("creates a new session when the last one expired or cannot be read", async () => {
    sessions.retrieve.mockResolvedValueOnce(session({ status: "expired", url: null }));
    await openQuoteCheckout(quote({ checkoutSessionId: "cs_old" }), options);

    sessions.retrieve.mockRejectedValueOnce(new Error("No such checkout.session"));
    await openQuoteCheckout(quote({ checkoutSessionId: "cs_old" }), options);

    expect(createInitialPaymentCheckout).toHaveBeenCalledTimes(2);
    expect(sessions.expire).not.toHaveBeenCalled();
  });

  it("gives up its own session when another request opened one at the same time", async () => {
    db.updateMany.mockResolvedValue({ count: 0 });
    db.findUniqueOrThrow.mockResolvedValue({ checkoutSessionId: "cs_other" });
    sessions.retrieve.mockResolvedValue(session({ id: "cs_other", url: "https://checkout.stripe.test/cs_other" }));

    const result = await openQuoteCheckout(quote(), options);

    expect(sessions.expire).toHaveBeenCalledWith("cs_new");
    expect(result).toEqual({ kind: "open", sessionUrl: "https://checkout.stripe.test/cs_other" });
  });
});

describe("expireQuoteCheckout", () => {
  it("expires the session and forgets it", async () => {
    await expireQuoteCheckout({ id: "q1", checkoutSessionId: "cs_old" });

    expect(sessions.expire).toHaveBeenCalledWith("cs_old");
    expect(db.updateMany).toHaveBeenCalledWith({
      where: { id: "q1", checkoutSessionId: "cs_old" },
      data: { checkoutSessionId: null },
    });
  });

  it("does not fail when Stripe refuses (already paid or expired)", async () => {
    sessions.expire.mockRejectedValue(new Error("Only open sessions can be expired"));

    await expect(expireQuoteCheckout({ id: "q1", checkoutSessionId: "cs_old" })).resolves.toBeUndefined();
  });

  it("does nothing for a quote without a session", async () => {
    await expireQuoteCheckout({ id: "q1", checkoutSessionId: null });

    expect(sessions.expire).not.toHaveBeenCalled();
    expect(db.updateMany).not.toHaveBeenCalled();
  });
});

describe("claimQuoteForProject", () => {
  it("lets one caller turn a sent quote into a project", async () => {
    expect(await claimQuoteForProject("q1")).toBe(true);
    expect(db.updateMany).toHaveBeenCalledWith({
      where: { id: "q1", status: "sent", projectId: null },
      data: { status: "accepted" },
    });

    db.updateMany.mockResolvedValue({ count: 0 });
    expect(await claimQuoteForProject("q1")).toBe(false);
  });

  it("gives the quote back when the project could not be created", async () => {
    await releaseQuoteClaim("q1");

    expect(db.updateMany).toHaveBeenCalledWith({
      where: { id: "q1", status: "accepted", projectId: null },
      data: { status: "sent" },
    });
  });
});
