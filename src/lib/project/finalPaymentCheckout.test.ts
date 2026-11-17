import { beforeEach, describe, expect, it, vi } from "vitest";

// vi.mock is hoisted above the imports, so the mocks it uses must be too
const { db, sessions } = vi.hoisted(() => ({
  db: { findUniqueOrThrow: vi.fn(), updateMany: vi.fn() },
  sessions: { create: vi.fn(), retrieve: vi.fn(), expire: vi.fn() },
}));

vi.mock("@/lib/prisma", () => ({ prisma: { payment: db } }));
vi.mock("@/lib/stripe", () => ({ default: { checkout: { sessions } } }));
vi.mock("@/lib/email/i18n", () => ({ emailTranslator: () => (key: string) => key }));
vi.mock("@/lib/projectUrl", () => ({
  SITE_BASE_URL: "https://site.test",
  getProjectUrl: (token: string) => `https://site.test/project/${token}`,
}));

import { closeFinalPaymentCheckout, openFinalPaymentCheckout } from "./finalPaymentCheckout";

const project = {
  id: "proj-1",
  projectCode: "AB3K9Z",
  planName: "Business Website",
  email: "ana@example.com",
  accessToken: "tok",
};

const charge = (overrides: Record<string, unknown> = {}) => ({
  id: "fin",
  amount: 100000,
  status: "pending",
  checkoutSessionId: null as string | null,
  ...overrides,
});

const session = (overrides: Record<string, unknown> = {}) => ({
  id: "cs_old",
  status: "open",
  url: "https://checkout.stripe.test/cs_old",
  amount_subtotal: 100000,
  customer_email: "ana@example.com",
  locale: "en",
  cancel_url: "https://site.test/project/tok",
  ...overrides,
});

beforeEach(() => {
  vi.resetAllMocks();
  db.updateMany.mockResolvedValue({ count: 1 });
  sessions.expire.mockResolvedValue({});
  sessions.create.mockResolvedValue({ id: "cs_new", url: "https://checkout.stripe.test/cs_new" });
});

describe("openFinalPaymentCheckout", () => {
  it("creates a session for the balance and remembers it on the charge", async () => {
    db.findUniqueOrThrow.mockResolvedValue(charge());

    const result = await openFinalPaymentCheckout(project, "magic-link", "en");

    expect(result).toEqual({ kind: "open", sessionUrl: "https://checkout.stripe.test/cs_new" });
    expect(sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_email: "ana@example.com",
        metadata: { paymentType: "final", projectId: "proj-1", projectCode: "AB3K9Z" },
        cancel_url: "https://site.test/project/tok",
      })
    );
    expect(sessions.create.mock.calls[0][0].line_items[0].price_data.unit_amount).toBe(100000);
    expect(db.updateMany).toHaveBeenCalledWith({
      where: { id: "fin", status: "pending", checkoutSessionId: null },
      data: { checkoutSessionId: "cs_new" },
    });
  });

  it("sends the customer back to the session that is still open", async () => {
    db.findUniqueOrThrow.mockResolvedValue(charge({ checkoutSessionId: "cs_old" }));
    sessions.retrieve.mockResolvedValue(session());

    const result = await openFinalPaymentCheckout(project, "magic-link", "en");

    expect(result).toEqual({ kind: "open", sessionUrl: "https://checkout.stripe.test/cs_old" });
    expect(sessions.create).not.toHaveBeenCalled();
  });

  it("opens nothing when the charge is settled", async () => {
    for (const status of ["paid", "refunded"]) {
      db.findUniqueOrThrow.mockResolvedValue(charge({ status }));
      expect(await openFinalPaymentCheckout(project, "form", "en")).toEqual({ kind: "paid" });
    }
    expect(sessions.retrieve).not.toHaveBeenCalled();
    expect(sessions.create).not.toHaveBeenCalled();
  });

  it("opens nothing when the last session was paid and the webhook has not recorded it yet", async () => {
    db.findUniqueOrThrow.mockResolvedValue(charge({ checkoutSessionId: "cs_old" }));
    sessions.retrieve.mockResolvedValue(session({ status: "complete", url: null }));

    expect(await openFinalPaymentCheckout(project, "magic-link", "en")).toEqual({ kind: "paid" });
    expect(sessions.create).not.toHaveBeenCalled();
  });

  it("replaces an open session in another language instead of leaving two open", async () => {
    db.findUniqueOrThrow.mockResolvedValue(charge({ checkoutSessionId: "cs_old" }));
    sessions.retrieve.mockResolvedValue(session());

    const result = await openFinalPaymentCheckout(project, "magic-link", "es");

    expect(sessions.expire).toHaveBeenCalledWith("cs_old");
    expect(result).toEqual({ kind: "open", sessionUrl: "https://checkout.stripe.test/cs_new" });
    expect(db.updateMany).toHaveBeenCalledWith({
      where: { id: "fin", status: "pending", checkoutSessionId: "cs_old" },
      data: { checkoutSessionId: "cs_new" },
    });
  });

  it("creates a new session when the last one expired or cannot be read", async () => {
    db.findUniqueOrThrow.mockResolvedValue(charge({ checkoutSessionId: "cs_old" }));

    sessions.retrieve.mockResolvedValueOnce(session({ status: "expired", url: null }));
    await openFinalPaymentCheckout(project, "magic-link", "en");

    sessions.retrieve.mockRejectedValueOnce(new Error("No such checkout.session"));
    await openFinalPaymentCheckout(project, "magic-link", "en");

    expect(sessions.create).toHaveBeenCalledTimes(2);
    expect(sessions.expire).not.toHaveBeenCalled();
  });

  it("gives up its own session when another request opened one at the same time", async () => {
    db.findUniqueOrThrow
      .mockResolvedValueOnce(charge())
      .mockResolvedValueOnce({ status: "pending", checkoutSessionId: "cs_other" });
    db.updateMany.mockResolvedValue({ count: 0 });
    sessions.retrieve.mockResolvedValue(session({ id: "cs_other", url: "https://checkout.stripe.test/cs_other" }));

    const result = await openFinalPaymentCheckout(project, "magic-link", "en");

    expect(sessions.expire).toHaveBeenCalledWith("cs_new");
    expect(result).toEqual({ kind: "open", sessionUrl: "https://checkout.stripe.test/cs_other" });
  });

  it("gives up its own session when the charge was paid meanwhile", async () => {
    db.findUniqueOrThrow
      .mockResolvedValueOnce(charge())
      .mockResolvedValueOnce({ status: "paid", checkoutSessionId: null });
    db.updateMany.mockResolvedValue({ count: 0 });

    const result = await openFinalPaymentCheckout(project, "magic-link", "en");

    expect(sessions.expire).toHaveBeenCalledWith("cs_new");
    expect(result).toEqual({ kind: "paid" });
  });
});

describe("closeFinalPaymentCheckout", () => {
  it("does nothing for a charge without a session", async () => {
    expect(await closeFinalPaymentCheckout({ id: "fin", checkoutSessionId: null })).toBe("closed");
    expect(sessions.retrieve).not.toHaveBeenCalled();
  });

  it("expires the open session and forgets it", async () => {
    sessions.retrieve
      .mockResolvedValueOnce(session())
      .mockResolvedValueOnce(session({ status: "expired", url: null }));

    expect(await closeFinalPaymentCheckout({ id: "fin", checkoutSessionId: "cs_old" })).toBe("closed");
    expect(sessions.expire).toHaveBeenCalledWith("cs_old");
    expect(db.updateMany).toHaveBeenCalledWith({
      where: { id: "fin", checkoutSessionId: "cs_old" },
      data: { checkoutSessionId: null },
    });
  });

  it("reports a session the customer already paid", async () => {
    sessions.retrieve.mockResolvedValue(session({ status: "complete", url: null }));

    expect(await closeFinalPaymentCheckout({ id: "fin", checkoutSessionId: "cs_old" })).toBe("paid");
    expect(sessions.expire).not.toHaveBeenCalled();
    expect(db.updateMany).not.toHaveBeenCalled();
  });

  it("reports a session paid in the instant before it was expired", async () => {
    sessions.retrieve
      .mockResolvedValueOnce(session())
      .mockResolvedValueOnce(session({ status: "complete", url: null }));
    sessions.expire.mockRejectedValue(new Error("Only open sessions can be expired"));

    expect(await closeFinalPaymentCheckout({ id: "fin", checkoutSessionId: "cs_old" })).toBe("paid");
    expect(db.updateMany).not.toHaveBeenCalled();
  });
});
