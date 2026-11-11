import { afterEach, describe, expect, it, vi } from "vitest";
import type Stripe from "stripe";

const { prisma, sessionsList, sendAdminPaymentIssueNotification, captureMessage } = vi.hoisted(() => ({
  prisma: { payment: { findUnique: vi.fn(), update: vi.fn() } },
  sessionsList: vi.fn(),
  sendAdminPaymentIssueNotification: vi.fn(
    async (): Promise<{ success: boolean; error?: string }> => ({ success: true })
  ),
  captureMessage: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({ prisma }));
vi.mock("@/lib/stripe", () => ({ default: { checkout: { sessions: { list: sessionsList } } } }));
vi.mock("@/lib/email", () => ({ sendAdminPaymentIssueNotification }));
vi.mock("@sentry/nextjs", () => ({ captureMessage }));
vi.mock("@/lib/projectUrl", () => ({ SITE_BASE_URL: "https://www.rcweb.dev" }));

import { handleChargeRefunded, handleDisputeClosed, handleDisputeCreated } from "./paymentIssues";

const resend = {} as never;
const now = new Date("2026-11-10T20:00:00Z");

const project = {
  id: "proj-1",
  projectCode: "AB3K9Z",
  name: "Ana",
  email: "ana@example.com",
  planName: "Website Redesign",
  status: "in_progress",
};

const payment = (overrides: Record<string, unknown> = {}) => ({
  id: "pay-1",
  kind: "deposit",
  amount: 100000,
  taxAmount: 6600,
  status: "paid",
  refundedAmount: 0,
  refundedAt: null,
  disputeId: null,
  disputeStatus: null,
  stripeSessionId: "cs_1",
  stripePaymentIntentId: "pi_1",
  project,
  ...overrides,
});

const charge = (overrides: Partial<Stripe.Charge> = {}) =>
  ({
    id: "ch_1",
    payment_intent: "pi_1",
    amount: 106600,
    amount_refunded: 106600,
    refunded: true,
    ...overrides,
  }) as Stripe.Charge;

const dispute = (overrides: Partial<Stripe.Dispute> = {}) =>
  ({
    id: "dp_1",
    payment_intent: "pi_1",
    amount: 106600,
    reason: "fraudulent",
    status: "needs_response",
    evidence_details: { due_by: 1794268800, has_evidence: false, past_due: false, submission_count: 0 },
    ...overrides,
  }) as Stripe.Dispute;

afterEach(() => vi.clearAllMocks());

describe("handleChargeRefunded", () => {
  it("marks the payment refunded and emails the admin", async () => {
    prisma.payment.findUnique.mockResolvedValueOnce(payment());

    const result = await handleChargeRefunded(charge(), resend, now);

    expect(result).toEqual({ received: true, updated: true });
    expect(prisma.payment.update).toHaveBeenCalledWith({
      where: { id: "pay-1" },
      data: { status: "refunded", refundedAmount: 106600, refundedAt: now },
    });
    expect(sendAdminPaymentIssueNotification).toHaveBeenCalledWith(
      resend,
      expect.objectContaining({
        kind: "refund",
        projectCode: "AB3K9Z",
        chargeLabel: "Deposit (50%)",
        chargeTotal: 106600,
        amount: 106600,
        adminProjectUrl: "https://www.rcweb.dev/projects/proj-1",
        stripeUrl: "https://dashboard.stripe.com/payments/pi_1",
      })
    );
  });

  it("records a partial refund without changing the status", async () => {
    prisma.payment.findUnique.mockResolvedValueOnce(payment());

    await handleChargeRefunded(charge({ amount_refunded: 20000, refunded: false }), resend, now);

    expect(prisma.payment.update).toHaveBeenCalledWith({
      where: { id: "pay-1" },
      data: { status: "paid", refundedAmount: 20000, refundedAt: now },
    });
  });

  it("does nothing on a retry that brings nothing new", async () => {
    prisma.payment.findUnique.mockResolvedValueOnce(payment({ refundedAmount: 20000, refundedAt: now }));

    const result = await handleChargeRefunded(charge({ amount_refunded: 20000, refunded: false }), resend, now);

    expect(result).toEqual({ received: true, updated: false });
    expect(prisma.payment.update).not.toHaveBeenCalled();
    expect(sendAdminPaymentIssueNotification).not.toHaveBeenCalled();
  });

  it("finds an older payment through its Checkout Session and backfills the PaymentIntent", async () => {
    prisma.payment.findUnique
      .mockResolvedValueOnce(null) // by payment intent
      .mockResolvedValueOnce(payment({ stripePaymentIntentId: null })); // by session
    sessionsList.mockResolvedValueOnce({ data: [{ id: "cs_1" }] });
    prisma.payment.update.mockResolvedValueOnce(payment()); // backfill returns the row

    const result = await handleChargeRefunded(charge(), resend, now);

    expect(sessionsList).toHaveBeenCalledWith({ payment_intent: "pi_1", limit: 1 });
    expect(prisma.payment.update).toHaveBeenNthCalledWith(1, {
      where: { id: "pay-1" },
      data: { stripePaymentIntentId: "pi_1" },
      include: expect.anything(),
    });
    expect(prisma.payment.update).toHaveBeenNthCalledWith(2, {
      where: { id: "pay-1" },
      data: { status: "refunded", refundedAmount: 106600, refundedAt: now },
    });
    expect(result).toEqual({ received: true, updated: true });
  });

  it("acknowledges a refund on a charge that is not a project payment (subscriptions, dashboard)", async () => {
    prisma.payment.findUnique.mockResolvedValueOnce(null);
    sessionsList.mockResolvedValueOnce({ data: [] });

    const result = await handleChargeRefunded(charge(), resend, now);

    expect(result).toEqual({ received: true, warning: "Refund on a charge that is not a project payment" });
    expect(prisma.payment.update).not.toHaveBeenCalled();
  });

  it("asks Stripe to retry when our own session has not been processed yet (events are unordered)", async () => {
    prisma.payment.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    sessionsList.mockResolvedValueOnce({ data: [{ id: "cs_1", metadata: { paymentType: "initial" } }] });

    const result = await handleChargeRefunded(charge(), resend, now);

    expect(result.retry).toBe(true);
    expect(prisma.payment.update).not.toHaveBeenCalled();
    expect(sendAdminPaymentIssueNotification).not.toHaveBeenCalled();
  });

  it("treats a subscription session without a payment row as foreign, not pending", async () => {
    prisma.payment.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    sessionsList.mockResolvedValueOnce({ data: [{ id: "cs_sub", metadata: { paymentType: "subscription" } }] });

    const result = await handleChargeRefunded(charge(), resend, now);

    expect(result.retry).toBeUndefined();
    expect(result.warning).toMatch(/not a project payment/);
  });

  it("acknowledges a charge without a PaymentIntent without calling Stripe", async () => {
    const result = await handleChargeRefunded(charge({ payment_intent: null }), resend, now);

    expect(result.warning).toBeDefined();
    expect(sessionsList).not.toHaveBeenCalled();
  });

  it("reports an email failure without failing the event", async () => {
    prisma.payment.findUnique.mockResolvedValueOnce(payment());
    sendAdminPaymentIssueNotification.mockResolvedValueOnce({ success: false, error: "quota" });

    const result = await handleChargeRefunded(charge(), resend, now);

    expect(result).toEqual({ received: true, updated: true, emailError: "quota" });
  });
});

describe("handleDisputeCreated", () => {
  it("stores the open dispute and emails the admin with the deadline", async () => {
    prisma.payment.findUnique.mockResolvedValueOnce(payment());

    const result = await handleDisputeCreated(dispute(), resend);

    expect(result).toEqual({ received: true, updated: true });
    expect(prisma.payment.update).toHaveBeenCalledWith({
      where: { id: "pay-1" },
      data: { disputeId: "dp_1", disputeStatus: "open" },
    });
    expect(sendAdminPaymentIssueNotification).toHaveBeenCalledWith(
      resend,
      expect.objectContaining({
        kind: "dispute_opened",
        amount: 106600,
        reason: "fraudulent",
        respondBy: new Date(1794268800 * 1000),
        stripeUrl: "https://dashboard.stripe.com/disputes/dp_1",
      })
    );
  });

  it("asks for a retry when the dispute arrives before the session was processed", async () => {
    prisma.payment.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    sessionsList.mockResolvedValueOnce({ data: [{ id: "cs_1", metadata: { paymentType: "initial" } }] });

    const result = await handleDisputeCreated(dispute(), resend);

    expect(result.retry).toBe(true);
  });

  it("is idempotent for the same dispute", async () => {
    prisma.payment.findUnique.mockResolvedValueOnce(payment({ disputeId: "dp_1", disputeStatus: "open" }));

    const result = await handleDisputeCreated(dispute(), resend);

    expect(result).toEqual({ received: true, updated: false });
    expect(prisma.payment.update).not.toHaveBeenCalled();
  });
});

describe("handleDisputeClosed", () => {
  it("keeps the charge paid when the dispute is won", async () => {
    prisma.payment.findUnique.mockResolvedValueOnce(payment({ disputeId: "dp_1", disputeStatus: "open" }));

    const result = await handleDisputeClosed(dispute({ status: "won" }), resend, now);

    expect(result).toEqual({ received: true, updated: true });
    expect(prisma.payment.update).toHaveBeenCalledWith({
      where: { id: "pay-1" },
      data: { disputeId: "dp_1", disputeStatus: "won" },
    });
    expect(sendAdminPaymentIssueNotification).toHaveBeenCalledWith(
      resend,
      expect.objectContaining({ kind: "dispute_won" })
    );
  });

  it("counts a lost dispute as a refund", async () => {
    prisma.payment.findUnique.mockResolvedValueOnce(payment({ disputeId: "dp_1", disputeStatus: "open" }));

    await handleDisputeClosed(dispute({ status: "lost" }), resend, now);

    expect(prisma.payment.update).toHaveBeenCalledWith({
      where: { id: "pay-1" },
      data: {
        disputeId: "dp_1",
        disputeStatus: "lost",
        status: "refunded",
        refundedAmount: 106600,
        refundedAt: now,
      },
    });
    expect(sendAdminPaymentIssueNotification).toHaveBeenCalledWith(
      resend,
      expect.objectContaining({ kind: "dispute_lost", amount: 106600 })
    );
  });

  it("treats an inquiry closed without a chargeback as won", async () => {
    prisma.payment.findUnique.mockResolvedValueOnce(payment({ disputeId: "dp_1", disputeStatus: "open" }));

    await handleDisputeClosed(dispute({ status: "warning_closed" }), resend, now);

    expect(prisma.payment.update).toHaveBeenCalledWith({
      where: { id: "pay-1" },
      data: { disputeId: "dp_1", disputeStatus: "won" },
    });
  });

  it("flags a closed event whose status is still open instead of guessing", async () => {
    prisma.payment.findUnique.mockResolvedValueOnce(payment());

    const result = await handleDisputeClosed(dispute({ status: "under_review" }), resend, now);

    expect(result.warning).toMatch(/under_review/);
    expect(captureMessage).toHaveBeenCalled();
    expect(prisma.payment.update).not.toHaveBeenCalled();
  });
});
