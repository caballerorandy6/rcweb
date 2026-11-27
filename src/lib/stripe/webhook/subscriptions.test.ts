import { beforeEach, describe, expect, it, vi } from "vitest";
import type Stripe from "stripe";

const { prisma, subscriptionsRetrieve, invoicesRetrieve, email, captureMessage } = vi.hoisted(() => {
  const sent: (resend: unknown, data: unknown) => Promise<{ success: boolean; error?: string }> = async () => ({
    success: true,
  });
  return {
    prisma: {
      subscription: { findUnique: vi.fn(), findUniqueOrThrow: vi.fn(), updateMany: vi.fn() },
    },
    subscriptionsRetrieve: vi.fn(),
    invoicesRetrieve: vi.fn(),
    email: {
      sendAdminSubscriptionNotification: vi.fn(sent),
      sendSubscriptionCancellationChange: vi.fn(sent),
      sendSubscriptionCancelled: vi.fn(sent),
      sendSubscriptionPaymentFailed: vi.fn(sent),
      sendSubscriptionRenewalReminder: vi.fn(sent),
    },
    captureMessage: vi.fn(),
  };
});

vi.mock("@/lib/prisma", () => ({ prisma }));
vi.mock("@/lib/stripe", () => ({
  default: {
    subscriptions: { retrieve: subscriptionsRetrieve },
    invoices: { retrieve: invoicesRetrieve },
  },
}));
vi.mock("@/lib/email", () => email);
vi.mock("@sentry/nextjs", () => ({ captureMessage }));
vi.mock("@/lib/projectUrl", () => ({ SITE_BASE_URL: "https://www.rcweb.dev" }));

import {
  handleInvoicePaid,
  handleInvoicePaymentFailed,
  handleInvoiceUpcoming,
  handleSubscriptionDeleted,
  handleSubscriptionUpdated,
} from "./subscriptions";

const resend = {} as never;
const SUB = "sub_test_1";
const PERIOD_START = 1_795_000_000;
const PERIOD_END = 1_797_592_000;

const row = (overrides: Record<string, unknown> = {}) => ({
  id: "row-1",
  stripeSubscriptionId: SUB,
  email: "ana@example.com",
  name: "Ana Pérez",
  locale: "es",
  planName: "Monthly Maintenance",
  amount: 20_000,
  status: "active",
  cancelAtPeriodEnd: false,
  currentPeriodEnd: new Date(PERIOD_END * 1000),
  ...overrides,
});

const stripeSubscription = (overrides: Record<string, unknown> = {}) =>
  ({
    id: SUB,
    status: "active",
    cancel_at_period_end: false,
    cancel_at: null,
    cancellation_details: null,
    ended_at: null,
    items: { data: [{ current_period_start: PERIOD_START, current_period_end: PERIOD_END }] },
    ...overrides,
  }) as unknown as Stripe.Subscription;

const invoice = (overrides: Record<string, unknown> = {}) =>
  ({
    id: "in_test_1",
    status: "open",
    billing_reason: "subscription_cycle",
    next_payment_attempt: null,
    parent: { subscription_details: { subscription: SUB } },
    payments: { data: [] },
    ...overrides,
  }) as unknown as Stripe.Invoice;

const changed = { count: 1 };
const unchanged = { count: 0 };

function expectNoEmails() {
  for (const send of Object.values(email)) expect(send).not.toHaveBeenCalled();
}

beforeEach(() => {
  vi.clearAllMocks();
  prisma.subscription.findUnique.mockResolvedValue(row());
  prisma.subscription.updateMany.mockResolvedValue(changed);
  subscriptionsRetrieve.mockResolvedValue(stripeSubscription());
  invoicesRetrieve.mockResolvedValue(invoice());
});

describe("handleSubscriptionUpdated", () => {
  it("does not bring a cancelled plan back when an old update arrives late", async () => {
    // The event still says active; Stripe says the subscription has ended
    prisma.subscription.findUnique.mockResolvedValue(row({ status: "cancelled" }));
    subscriptionsRetrieve.mockResolvedValue(stripeSubscription({ status: "canceled" }));

    const result = await handleSubscriptionUpdated(stripeSubscription({ status: "active" }), resend);

    expect(result).toEqual({ received: true, updated: false });
    expect(prisma.subscription.updateMany).not.toHaveBeenCalled();
    expectNoEmails();
  });

  it("never writes over a row that is already cancelled", async () => {
    await handleSubscriptionUpdated(stripeSubscription(), resend);

    for (const [args] of prisma.subscription.updateMany.mock.calls) {
      expect(args.where.status).toEqual({ not: "cancelled" });
    }
  });

  it("stores the subscription as Stripe has it now, not the event's snapshot", async () => {
    subscriptionsRetrieve.mockResolvedValue(stripeSubscription({ status: "past_due" }));
    prisma.subscription.updateMany.mockResolvedValueOnce(unchanged).mockResolvedValueOnce(changed);

    const result = await handleSubscriptionUpdated(stripeSubscription({ status: "active" }), resend);

    expect(result).toEqual({ received: true, updated: true });
    expect(prisma.subscription.updateMany).toHaveBeenLastCalledWith({
      where: { stripeSubscriptionId: SUB, status: { not: "cancelled" } },
      data: {
        status: "past_due",
        currentPeriodStart: new Date(PERIOD_START * 1000),
        currentPeriodEnd: new Date(PERIOD_END * 1000),
      },
    });
    expectNoEmails();
  });

  it("announces a scheduled cancellation once, with the last day and the reason", async () => {
    const cancelAt = PERIOD_END + 86_400;
    subscriptionsRetrieve.mockResolvedValue(
      stripeSubscription({
        cancel_at: cancelAt,
        cancellation_details: { feedback: "too_expensive", comment: null },
      })
    );

    await handleSubscriptionUpdated(stripeSubscription(), resend);

    expect(email.sendSubscriptionCancellationChange).toHaveBeenCalledTimes(1);
    expect(email.sendSubscriptionCancellationChange.mock.calls[0][1]).toMatchObject({
      kind: "scheduled",
      locale: "es",
      date: new Date(cancelAt * 1000),
      manageUrl: "https://www.rcweb.dev/es/gestionar-suscripcion",
    });
    expect(email.sendAdminSubscriptionNotification.mock.calls[0][1]).toMatchObject({
      event: "subscription_cancel_scheduled",
      cancellationReason: "too expensive",
    });
  });

  it("stays quiet when another delivery already flipped the flag", async () => {
    subscriptionsRetrieve.mockResolvedValue(stripeSubscription({ cancel_at_period_end: true }));
    prisma.subscription.updateMany.mockResolvedValueOnce(unchanged).mockResolvedValueOnce(changed);

    await handleSubscriptionUpdated(stripeSubscription(), resend);

    expectNoEmails();
  });

  it("acknowledges a subscription it has no row for without calling Stripe", async () => {
    prisma.subscription.findUnique.mockResolvedValue(null);

    const result = await handleSubscriptionUpdated(stripeSubscription(), resend);

    expect(result).toMatchObject({ received: true, warning: expect.any(String) });
    expect(subscriptionsRetrieve).not.toHaveBeenCalled();
  });

  it("fails on a Stripe or database error, so the webhook is retried", async () => {
    subscriptionsRetrieve.mockRejectedValue(new Error("stripe is down"));
    await expect(handleSubscriptionUpdated(stripeSubscription(), resend)).rejects.toThrow("stripe is down");

    subscriptionsRetrieve.mockResolvedValue(stripeSubscription());
    prisma.subscription.updateMany.mockRejectedValue(new Error("connection reset"));
    await expect(handleSubscriptionUpdated(stripeSubscription(), resend)).rejects.toThrow("connection reset");
  });
});

describe("handleInvoicePaymentFailed", () => {
  beforeEach(() => {
    subscriptionsRetrieve.mockResolvedValue(stripeSubscription({ status: "past_due" }));
  });

  it("marks the plan past due and tells the customer and the admin", async () => {
    const result = await handleInvoicePaymentFailed(invoice(), resend);

    expect(result).toEqual({ received: true, paymentFailed: true, notified: true });
    expect(prisma.subscription.updateMany).toHaveBeenNthCalledWith(1, {
      where: { id: "row-1", status: { not: "cancelled" } },
      data: { status: "past_due" },
    });
    expect(email.sendSubscriptionPaymentFailed).toHaveBeenCalledTimes(1);
    expect(email.sendSubscriptionPaymentFailed.mock.calls[0][1]).toMatchObject({
      customerEmail: "ana@example.com",
      locale: "es",
      updatePaymentUrl: "https://www.rcweb.dev/es/gestionar-suscripcion",
    });
    expect(email.sendAdminSubscriptionNotification.mock.calls[0][1]).toMatchObject({
      event: "subscription_payment_failed",
      status: "past_due",
    });
  });

  it("emails once per invoice, however many attempts or deliveries fail", async () => {
    // The status write succeeds; the claim of this invoice was already taken
    prisma.subscription.updateMany.mockResolvedValueOnce(changed).mockResolvedValueOnce(unchanged);

    const result = await handleInvoicePaymentFailed(invoice(), resend);

    expect(result).toEqual({ received: true, paymentFailed: true, notified: false });
    expect(prisma.subscription.updateMany).toHaveBeenNthCalledWith(2, {
      where: {
        id: "row-1",
        OR: [{ paymentFailedInvoiceId: null }, { paymentFailedInvoiceId: { not: "in_test_1" } }],
      },
      data: { paymentFailedInvoiceId: "in_test_1" },
    });
    expectNoEmails();
  });

  it("ignores a failure that arrives after the invoice was paid", async () => {
    invoicesRetrieve.mockResolvedValue(invoice({ status: "paid" }));

    const result = await handleInvoicePaymentFailed(invoice(), resend);

    expect(result).toMatchObject({ received: true, paymentFailed: false });
    expect(prisma.subscription.updateMany).not.toHaveBeenCalled();
    expectNoEmails();
  });

  it("tells only the admin when the bank asks the customer to confirm (3D Secure)", async () => {
    invoicesRetrieve.mockResolvedValue(
      invoice({ payments: { data: [{ payment: { payment_intent: { status: "requires_action" } } }] } })
    );

    const result = await handleInvoicePaymentFailed(invoice(), resend);

    expect(result).toMatchObject({ paymentNeedsAuthentication: true });
    expect(email.sendSubscriptionPaymentFailed).not.toHaveBeenCalled();
    expect(email.sendAdminSubscriptionNotification.mock.calls[0][1]).toMatchObject({
      event: "subscription_payment_action_required",
    });
  });

  it("fails on a database error, so the webhook is retried", async () => {
    prisma.subscription.updateMany.mockRejectedValue(new Error("connection reset"));

    await expect(handleInvoicePaymentFailed(invoice(), resend)).rejects.toThrow("connection reset");
    expectNoEmails();
  });

  it("reports an email that could not be sent", async () => {
    email.sendSubscriptionPaymentFailed.mockResolvedValueOnce({ success: false, error: "quota" });

    await handleInvoicePaymentFailed(invoice(), resend);

    expect(captureMessage).toHaveBeenCalledTimes(1);
    expect(captureMessage.mock.calls[0][1]).toMatchObject({
      extra: { invoiceId: "in_test_1", error: "quota" },
    });
  });
});

describe("handleInvoiceUpcoming", () => {
  it("sends the reminder and remembers the period it was for", async () => {
    const attempt = PERIOD_END;
    const result = await handleInvoiceUpcoming(invoice({ next_payment_attempt: attempt }), resend);

    expect(result).toEqual({ received: true, reminderSent: true });
    const period = new Date(PERIOD_END * 1000);
    expect(prisma.subscription.updateMany).toHaveBeenCalledWith({
      where: {
        id: "row-1",
        status: "active",
        cancelAtPeriodEnd: false,
        OR: [{ renewalReminderFor: null }, { renewalReminderFor: { not: period } }],
      },
      data: { renewalReminderFor: period },
    });
    expect(email.sendSubscriptionRenewalReminder).toHaveBeenCalledTimes(1);
    expect(email.sendSubscriptionRenewalReminder.mock.calls[0][1]).toMatchObject({
      renewalDate: new Date(attempt * 1000),
      locale: "es",
    });
  });

  it("does not remind twice for the same period", async () => {
    prisma.subscription.updateMany.mockResolvedValue(unchanged);

    const result = await handleInvoiceUpcoming(invoice(), resend);

    expect(result).toEqual({ received: true, reminderSent: false });
    expectNoEmails();
  });

  it.each([
    ["is scheduled to cancel", { cancelAtPeriodEnd: true }],
    ["is past due", { status: "past_due" }],
    ["is cancelled", { status: "cancelled" }],
  ])("does not announce a renewal of a plan that %s", async (_label, overrides) => {
    prisma.subscription.findUnique.mockResolvedValue(row(overrides));

    const result = await handleInvoiceUpcoming(invoice(), resend);

    expect(result).toEqual({ received: true, reminderSent: false });
    expect(prisma.subscription.updateMany).not.toHaveBeenCalled();
    expectNoEmails();
  });
});

describe("handleInvoicePaid", () => {
  it("ignores the first invoice: the signup already wrote the row", async () => {
    const result = await handleInvoicePaid(invoice({ billing_reason: "subscription_create" }));

    expect(result).toEqual({ received: true });
    expect(prisma.subscription.findUnique).not.toHaveBeenCalled();
  });

  it("stores the new period of a renewal without emailing anyone", async () => {
    const result = await handleInvoicePaid(invoice({ status: "paid" }));

    expect(result).toEqual({ received: true, renewed: true });
    expect(prisma.subscription.updateMany).toHaveBeenCalledWith({
      where: { stripeSubscriptionId: SUB, status: { not: "cancelled" } },
      data: {
        status: "active",
        currentPeriodStart: new Date(PERIOD_START * 1000),
        currentPeriodEnd: new Date(PERIOD_END * 1000),
      },
    });
    expectNoEmails();
  });

  it("leaves an ended subscription to its own event", async () => {
    subscriptionsRetrieve.mockResolvedValue(stripeSubscription({ status: "canceled" }));

    expect(await handleInvoicePaid(invoice())).toEqual({ received: true, renewed: false });
    expect(prisma.subscription.updateMany).not.toHaveBeenCalled();
  });

  it("acknowledges a subscription it has no row for", async () => {
    prisma.subscription.findUnique.mockResolvedValue(null);

    expect(await handleInvoicePaid(invoice())).toMatchObject({ received: true, warning: expect.any(String) });
    expect(subscriptionsRetrieve).not.toHaveBeenCalled();
  });

  it("fails when Stripe cannot be read, so the renewal is retried", async () => {
    subscriptionsRetrieve.mockRejectedValue(new Error("stripe is down"));

    await expect(handleInvoicePaid(invoice())).rejects.toThrow("stripe is down");
  });
});

describe("handleSubscriptionDeleted", () => {
  const ended = stripeSubscription({ status: "canceled", ended_at: 1_796_000_000 });

  it("cancels the row with Stripe's end time and tells the customer and the admin once", async () => {
    prisma.subscription.findUniqueOrThrow.mockResolvedValue(row({ status: "cancelled" }));

    const result = await handleSubscriptionDeleted(ended, resend);

    expect(result).toEqual({ received: true, cancelled: true });
    expect(prisma.subscription.updateMany).toHaveBeenCalledWith({
      where: { stripeSubscriptionId: SUB, status: { not: "cancelled" } },
      data: { status: "cancelled", cancelledAt: new Date(1_796_000_000 * 1000), cancelAtPeriodEnd: false },
    });
    expect(email.sendSubscriptionCancelled).toHaveBeenCalledTimes(1);
    expect(email.sendAdminSubscriptionNotification).toHaveBeenCalledTimes(1);
  });

  it("sends nothing when the row was already cancelled", async () => {
    prisma.subscription.updateMany.mockResolvedValue(unchanged);

    expect(await handleSubscriptionDeleted(ended, resend)).toEqual({ received: true, alreadyCancelled: true });
    expectNoEmails();
  });
});
