import { beforeEach, describe, expect, it, vi } from "vitest";
import Stripe from "stripe";

// The route is exercised as Stripe calls it: a POST whose body is signed with
// the endpoint secret. Signature verification is the real one from the SDK;
// the database, the emails and the helpers with their own tests are mocked.

const WEBHOOK_SECRET = "whsec_route_test_secret";

const mocks = vi.hoisted(() => {
  // The route reads both at import time and throws without them
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_route_test_secret";
  process.env.RESEND_API_KEY = "re_route_test";

  const sent: (resend: unknown, data: unknown) => Promise<{ success: boolean; error?: string }> = async () => ({
    success: true,
  });
  return {
    prisma: {
      project: { findUnique: vi.fn(), findUniqueOrThrow: vi.fn() },
      subscription: {
        findUnique: vi.fn(),
        findUniqueOrThrow: vi.fn(),
        update: vi.fn(),
        updateMany: vi.fn(),
      },
      $transaction: vi.fn(),
    },
    createProjectFromDeposit: vi.fn(),
    markChargePaid: vi.fn(),
    createInvoiceAndSendEmail: vi.fn(),
    captureException: vi.fn(),
    captureMessage: vi.fn(),
    subscriptionsRetrieve: vi.fn(),
    email: {
      sendSubscriptionConfirmation: vi.fn(sent),
      sendAdminSubscriptionNotification: vi.fn(sent),
      sendAdminInitialPaymentNotification: vi.fn(sent),
      sendAdminFinalPaymentNotification: vi.fn(sent),
      sendSubscriptionRenewalReminder: vi.fn(sent),
      sendSubscriptionPaymentFailed: vi.fn(sent),
      sendSubscriptionCancelled: vi.fn(sent),
      sendSubscriptionCancellationChange: vi.fn(sent),
    },
    issues: {
      handleChargeRefunded: vi.fn(),
      handleDisputeCreated: vi.fn(),
      handleDisputeClosed: vi.fn(),
      reportUnrecordedFinalPayment: vi.fn(),
    },
    subscriptions: {
      handleInvoicePaid: vi.fn(),
      handleInvoiceUpcoming: vi.fn(),
      handleInvoicePaymentFailed: vi.fn(),
      handleSubscriptionDeleted: vi.fn(),
      handleSubscriptionUpdated: vi.fn(),
    },
  };
});

vi.mock("@/lib/prisma", () => ({ prisma: mocks.prisma }));
vi.mock("@/lib/stripe", async () => {
  const { default: StripeSdk } = await import("stripe");
  // Real webhook verification, no network for the rest
  return {
    default: {
      webhooks: new StripeSdk("sk_test_route").webhooks,
      subscriptions: { retrieve: mocks.subscriptionsRetrieve },
      invoices: { retrieve: vi.fn() },
    },
  };
});
vi.mock("resend", () => ({ Resend: vi.fn() }));
vi.mock("@sentry/nextjs", () => ({
  captureException: mocks.captureException,
  captureMessage: mocks.captureMessage,
}));
vi.mock("@/lib/email", () => mocks.email);
vi.mock("@/lib/project/createProjectFromDeposit", () => ({
  createProjectFromDeposit: mocks.createProjectFromDeposit,
}));
vi.mock("@/lib/project/markChargePaid", () => ({ markChargePaid: mocks.markChargePaid }));
vi.mock("@/lib/invoice/createInvoiceAndSendEmail", () => ({
  createInvoiceAndSendEmail: mocks.createInvoiceAndSendEmail,
}));
vi.mock("@/lib/stripe/webhook/paymentIssues", () => mocks.issues);
vi.mock("@/lib/stripe/webhook/subscriptions", () => mocks.subscriptions);

import { POST } from "./route";

const {
  prisma,
  createProjectFromDeposit,
  markChargePaid,
  createInvoiceAndSendEmail,
  captureException,
  captureMessage,
  email,
  issues,
  subscriptions,
} = mocks;

const URL = "https://www.rcweb.dev/api/webhooks/stripe";
const PROJECT_ID = "3f0c1b9e-6a55-4d0e-9f43-2b6a0c1d7e11";
const QUOTE_ID = "9b2d6c1a-0f3e-4a7b-8c5d-1e2f3a4b5c6d";

function signedRequest(event: unknown, secret = WEBHOOK_SECRET) {
  const payload = JSON.stringify(event);
  const signature = Stripe.webhooks.generateTestHeaderString({ payload, secret });
  return new Request(URL, {
    method: "POST",
    headers: { "stripe-signature": signature },
    body: payload,
  });
}

const eventOf = (type: string, object: unknown) => ({
  id: "evt_test_1",
  object: "event",
  type,
  data: { object },
});

const deliver = (type: string, object: unknown) => POST(signedRequest(eventOf(type, object)));

function session(metadata: Record<string, string> | null, overrides: Record<string, unknown> = {}) {
  return {
    id: "cs_test_deposit",
    object: "checkout.session",
    metadata,
    payment_intent: "pi_test_1",
    amount_total: 106_600,
    total_details: { amount_tax: 6_600 },
    customer_details: {
      address: {
        line1: "901 Bagby St",
        line2: null,
        city: "Houston",
        state: "TX",
        postal_code: "77002",
        country: "US",
      },
    },
    ...overrides,
  };
}

const initialMetadata = {
  paymentType: "initial",
  projectCode: "AB3K9Z",
  planName: "Website Redesign",
  customerName: "Ana Pérez",
  customerEmail: "Ana@Example.com",
  firstPaymentAmount: "100000",
  secondPaymentAmount: "100000",
  totalAmount: "200000",
  termsAcceptedAt: "2026-11-17T18:00:00.000Z",
  locale: "es",
  quoteId: QUOTE_ID,
};

const finalMetadata = { paymentType: "final", projectId: PROJECT_ID, projectCode: "AB3K9Z" };

type Charge = Record<string, unknown>;

function project(final: Charge = {}, invoices: string[] = ["initial"]) {
  return {
    id: PROJECT_ID,
    projectCode: "AB3K9Z",
    name: "Ana Pérez",
    email: "ana@example.com",
    planName: "Website Redesign",
    totalAmount: 200_000,
    status: "ready_for_payment",
    payments: [
      { id: "dep", kind: "deposit", status: "paid", amount: 100_000, stripeSessionId: "cs_test_deposit" },
      { id: "fin", kind: "final", status: "pending", amount: 100_000, stripeSessionId: null, ...final },
    ],
    invoices: invoices.map((type) => ({ type })),
  };
}

const finalSession = () => session(finalMetadata, { id: "cs_test_final", payment_intent: "pi_test_2" });

/** No write of any kind: nothing created, paid, invoiced or emailed */
function expectNoWrites() {
  expect(createProjectFromDeposit).not.toHaveBeenCalled();
  expect(markChargePaid).not.toHaveBeenCalled();
  expect(createInvoiceAndSendEmail).not.toHaveBeenCalled();
  expect(prisma.project.findUnique).not.toHaveBeenCalled();
  expect(prisma.$transaction).not.toHaveBeenCalled();
  for (const send of Object.values(email)) expect(send).not.toHaveBeenCalled();
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("signature", () => {
  it("rejects a request without a signature", async () => {
    const response = await POST(
      new Request(URL, { method: "POST", body: JSON.stringify(eventOf("checkout.session.completed", session(initialMetadata))) })
    );

    expect(response.status).toBe(400);
    expectNoWrites();
  });

  it("rejects an event signed with another secret", async () => {
    const response = await POST(
      signedRequest(eventOf("checkout.session.completed", session(initialMetadata)), "whsec_someone_else")
    );

    expect(response.status).toBe(400);
    expectNoWrites();
  });

  it("rejects a body changed after it was signed", async () => {
    const signed = signedRequest(eventOf("checkout.session.completed", session(initialMetadata)));
    const tampered = (await signed.text()).replace('"100000"', '"1"');

    const response = await POST(
      new Request(URL, {
        method: "POST",
        headers: { "stripe-signature": signed.headers.get("stripe-signature")! },
        body: tampered,
      })
    );

    expect(response.status).toBe(400);
    expectNoWrites();
  });

  it("acknowledges an event type it does not handle", async () => {
    const response = await deliver("payment_intent.created", { id: "pi_test_1" });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true });
    expectNoWrites();
  });
});

describe("checkout.session.completed: metadata", () => {
  it("acknowledges a session that is not ours without touching anything", async () => {
    const response = await deliver("checkout.session.completed", session({ order: "payment-link" }));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ received: true, warning: expect.any(String) });
    expectNoWrites();
  });

  it("acknowledges a session without metadata", async () => {
    const response = await deliver("checkout.session.completed", session(null));

    expect(response.status).toBe(200);
    expectNoWrites();
  });

  it("answers 400 to our own metadata when it does not parse", async () => {
    const response = await deliver(
      "checkout.session.completed",
      session({ ...initialMetadata, firstPaymentAmount: "1000.50" })
    );

    expect(response.status).toBe(400);
    expectNoWrites();
  });

  it("answers 400 to a final payment without a project id", async () => {
    const response = await deliver("checkout.session.completed", session({ paymentType: "final", projectCode: "AB3K9Z" }));

    expect(response.status).toBe(400);
    expectNoWrites();
  });
});

describe("checkout.session.completed: deposit", () => {
  const created = { project: { id: PROJECT_ID }, created: true, emailErrors: [] as string[] };

  it("creates the project from what the session carries and tells the admin", async () => {
    createProjectFromDeposit.mockResolvedValue(created);

    const response = await deliver("checkout.session.completed", session(initialMetadata));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true, projectId: PROJECT_ID });
    expect(createProjectFromDeposit).toHaveBeenCalledTimes(1);
    expect(createProjectFromDeposit.mock.calls[0][0]).toMatchObject({
      projectCode: "AB3K9Z",
      customerEmail: "ana@example.com",
      customerName: "Ana Pérez",
      locale: "es",
      planName: "Website Redesign",
      totalAmount: 200_000,
      firstPaymentAmount: 100_000,
      secondPaymentAmount: 100_000,
      deposit: {
        method: "stripe",
        stripeSessionId: "cs_test_deposit",
        stripePaymentIntentId: "pi_test_1",
        taxAmount: 6_600,
      },
      terms: {
        acceptedAt: new Date("2026-11-17T18:00:00.000Z"),
        ipAddress: "stripe-checkout",
      },
      quoteId: QUOTE_ID,
      billingAddress: { line1: "901 Bagby St", city: "Houston", state: "TX", postalCode: "77002", country: "US" },
    });
    expect(email.sendAdminInitialPaymentNotification).toHaveBeenCalledTimes(1);
    expect(email.sendAdminInitialPaymentNotification.mock.calls[0][1]).toMatchObject({
      projectCode: "AB3K9Z",
      projectId: PROJECT_ID,
      firstPaymentAmount: 100_000,
    });
  });

  it("records no tax and no address when Checkout collected none", async () => {
    createProjectFromDeposit.mockResolvedValue(created);

    await deliver(
      "checkout.session.completed",
      session(initialMetadata, { total_details: null, customer_details: null, payment_intent: { id: "pi_expanded" } })
    );

    expect(createProjectFromDeposit.mock.calls[0][0]).toMatchObject({
      deposit: { taxAmount: 0, stripePaymentIntentId: "pi_expanded" },
      billingAddress: null,
    });
  });

  it("treats a session created before the locale field as English", async () => {
    createProjectFromDeposit.mockResolvedValue(created);
    const legacy = Object.fromEntries(
      Object.entries(initialMetadata).filter(([key]) => key !== "locale" && key !== "quoteId")
    );

    await deliver("checkout.session.completed", session(legacy));

    const input = createProjectFromDeposit.mock.calls[0][0];
    expect(input.locale).toBe("en");
    expect(input.quoteId).toBeUndefined();
  });

  it("does not tell the admin again when the same event is delivered twice", async () => {
    createProjectFromDeposit.mockResolvedValue({ ...created, created: false });

    const response = await deliver("checkout.session.completed", session(initialMetadata));

    expect(response.status).toBe(200);
    expect(email.sendAdminInitialPaymentNotification).not.toHaveBeenCalled();
  });

  it("answers 200 with the problems when the invoice or an email failed", async () => {
    createProjectFromDeposit.mockResolvedValue({ ...created, emailErrors: ["Error creating invoice: blob down"] });
    email.sendAdminInitialPaymentNotification.mockResolvedValueOnce({ success: false, error: "quota reached" });

    const response = await deliver("checkout.session.completed", session(initialMetadata));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      received: true,
      projectId: PROJECT_ID,
      emailErrors: ["Error creating invoice: blob down", "quota reached"],
    });
  });

  it("fails the delivery when the project could not be created, so Stripe retries", async () => {
    createProjectFromDeposit.mockRejectedValue(new Error("Project code AB3K9Z already belongs to another Checkout Session"));

    await expect(deliver("checkout.session.completed", session(initialMetadata))).rejects.toThrow(
      "already belongs to another Checkout Session"
    );
    expect(email.sendAdminInitialPaymentNotification).not.toHaveBeenCalled();
  });
});

describe("checkout.session.completed: final payment", () => {
  const paidBy = (sessionId: string) => ({ status: "paid", stripeSessionId: sessionId });

  it("answers 404 when the project does not exist", async () => {
    prisma.project.findUnique.mockResolvedValue(null);

    const response = await deliver("checkout.session.completed", finalSession());

    expect(response.status).toBe(404);
    expect(markChargePaid).not.toHaveBeenCalled();
    expect(createInvoiceAndSendEmail).not.toHaveBeenCalled();
  });

  it("records the payment, completes the project, invoices it and tells the admin", async () => {
    prisma.project.findUnique.mockResolvedValue(project());
    markChargePaid.mockResolvedValue(true);
    prisma.project.findUniqueOrThrow.mockResolvedValue(project(paidBy("cs_test_final")));

    const response = await deliver("checkout.session.completed", finalSession());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true, completed: true });
    expect(markChargePaid).toHaveBeenCalledTimes(1);
    expect(markChargePaid.mock.calls[0][0]).toMatchObject({
      projectId: PROJECT_ID,
      chargeId: "fin",
      charge: {
        checkoutSessionId: null,
        stripeSessionId: "cs_test_final",
        stripePaymentIntentId: "pi_test_2",
        taxAmount: 6_600,
      },
      project: { status: "completed" },
    });
    expect(createInvoiceAndSendEmail.mock.calls.map(([args]) => args.type)).toEqual(["final", "summary"]);
    // The invoices are built from the project as it is after the payment
    expect(createInvoiceAndSendEmail.mock.calls[0][0].project.payments[1].status).toBe("paid");
    expect(email.sendAdminFinalPaymentNotification).toHaveBeenCalledTimes(1);
    expect(email.sendAdminFinalPaymentNotification.mock.calls[0][1]).toMatchObject({
      projectCode: "AB3K9Z",
      finalPaymentAmount: 100_000,
      totalAmount: 200_000,
    });
    expect(issues.reportUnrecordedFinalPayment).not.toHaveBeenCalled();
  });

  it("does nothing more when the same event arrives again", async () => {
    prisma.project.findUnique.mockResolvedValue(
      project(paidBy("cs_test_final"), ["initial", "final", "summary"])
    );

    const response = await deliver("checkout.session.completed", finalSession());

    expect(response.status).toBe(200);
    expect(markChargePaid).not.toHaveBeenCalled();
    expect(createInvoiceAndSendEmail).not.toHaveBeenCalled();
    expect(email.sendAdminFinalPaymentNotification).not.toHaveBeenCalled();
    expect(issues.reportUnrecordedFinalPayment).not.toHaveBeenCalled();
  });

  it("creates only the invoice that is missing on a resent event, without a second admin email", async () => {
    prisma.project.findUnique.mockResolvedValue(project(paidBy("cs_test_final"), ["initial", "final"]));

    const response = await deliver("checkout.session.completed", finalSession());

    expect(response.status).toBe(200);
    expect(createInvoiceAndSendEmail.mock.calls.map(([args]) => args.type)).toEqual(["summary"]);
    expect(email.sendAdminFinalPaymentNotification).not.toHaveBeenCalled();
  });

  it("leaves the admin email to the delivery that recorded the payment when two arrive at once", async () => {
    prisma.project.findUnique.mockResolvedValue(project());
    // The other delivery won the write
    markChargePaid.mockResolvedValue(false);
    prisma.project.findUniqueOrThrow.mockResolvedValue(project(paidBy("cs_test_final")));

    const response = await deliver("checkout.session.completed", finalSession());

    expect(response.status).toBe(200);
    expect(email.sendAdminFinalPaymentNotification).not.toHaveBeenCalled();
    expect(issues.reportUnrecordedFinalPayment).not.toHaveBeenCalled();
  });

  it.each([
    ["another Checkout Session", { status: "paid", stripeSessionId: "cs_test_other" }],
    ["Zelle or cash", { status: "paid", method: "zelle", stripeSessionId: null }],
    ["a payment refunded since", { status: "refunded", stripeSessionId: "cs_test_other" }],
  ])("does not record a second payment of a charge settled by %s and asks the admin to refund it", async (_, final) => {
    prisma.project.findUnique.mockResolvedValue(project(final, ["initial", "final", "summary"]));
    issues.reportUnrecordedFinalPayment.mockResolvedValue(undefined);

    const response = await deliver("checkout.session.completed", finalSession());

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ received: true, warning: expect.stringContaining("already settled") });
    expect(markChargePaid).not.toHaveBeenCalled();
    expect(createInvoiceAndSendEmail).not.toHaveBeenCalled();
    expect(email.sendAdminFinalPaymentNotification).not.toHaveBeenCalled();
    expect(issues.reportUnrecordedFinalPayment).toHaveBeenCalledTimes(1);
    expect(issues.reportUnrecordedFinalPayment.mock.calls[0][1]).toMatchObject({
      sessionId: "cs_test_final",
      amountPaid: 106_600,
      paymentIntentId: "pi_test_2",
    });
  });

  it("reports a second payment that lost the race to another session", async () => {
    prisma.project.findUnique.mockResolvedValue(project());
    markChargePaid.mockResolvedValue(false);
    prisma.project.findUniqueOrThrow.mockResolvedValue(project(paidBy("cs_test_other")));
    issues.reportUnrecordedFinalPayment.mockResolvedValue("quota reached");

    const response = await deliver("checkout.session.completed", finalSession());

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ emailErrors: ["quota reached"] });
    expect(createInvoiceAndSendEmail).not.toHaveBeenCalled();
  });

  it("keeps the payment and answers 200 when an invoice fails", async () => {
    prisma.project.findUnique.mockResolvedValue(project());
    markChargePaid.mockResolvedValue(true);
    prisma.project.findUniqueOrThrow.mockResolvedValue(project(paidBy("cs_test_final")));
    createInvoiceAndSendEmail.mockRejectedValueOnce(new Error("blob down")).mockResolvedValueOnce({});

    const response = await deliver("checkout.session.completed", finalSession());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      received: true,
      completed: true,
      emailErrors: ["Error creating final invoice: blob down"],
    });
    // The summary is still attempted and the admin still hears about the payment
    expect(createInvoiceAndSendEmail).toHaveBeenCalledTimes(2);
    expect(email.sendAdminFinalPaymentNotification).toHaveBeenCalledTimes(1);
    expect(captureException).toHaveBeenCalledTimes(1);
  });

  it("fails the delivery on a database error, so Stripe retries", async () => {
    prisma.project.findUnique.mockRejectedValue(new Error("connection reset"));

    await expect(deliver("checkout.session.completed", finalSession())).rejects.toThrow("connection reset");
  });
});

describe("checkout.session.completed: subscription", () => {
  const subscriptionMetadata = {
    paymentType: "subscription",
    planName: "Care Plan",
    customerName: "Ana Pérez",
    customerEmail: "ana@example.com",
    termsAcceptedAt: "2026-11-17T18:00:00.000Z",
    locale: "en",
  };

  it("answers 400 when the session has no subscription", async () => {
    const response = await deliver(
      "checkout.session.completed",
      session(subscriptionMetadata, { subscription: null })
    );

    expect(response.status).toBe(400);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("does not create or email a subscription it already has", async () => {
    prisma.subscription.findUnique.mockResolvedValue({ id: "sub-row" });

    const response = await deliver(
      "checkout.session.completed",
      session(subscriptionMetadata, { subscription: "sub_test_1" })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true, duplicate: "SUBSCRIPTION_EXISTS" });
    expect(prisma.$transaction).not.toHaveBeenCalled();
    expect(email.sendSubscriptionConfirmation).not.toHaveBeenCalled();
    expect(email.sendAdminSubscriptionNotification).not.toHaveBeenCalled();
  });
});

describe("checkout.session.completed: subscription emails", () => {
  it("reports a confirmation that could not be sent, since no retry will send it", async () => {
    prisma.subscription.findUnique.mockResolvedValue(null);
    mocks.subscriptionsRetrieve.mockResolvedValue({
      customer: "cus_test_1",
      status: "active",
      items: { data: [{ price: { unit_amount: 20_000 }, current_period_start: 1, current_period_end: 2 }] },
    });
    prisma.$transaction.mockResolvedValue({ id: "sub-row" });
    email.sendSubscriptionConfirmation.mockResolvedValueOnce({ success: false, error: "quota exceeded" });

    const response = await deliver(
      "checkout.session.completed",
      session(
        {
          paymentType: "subscription",
          planName: "Care Plan",
          customerName: "Ana Pérez",
          customerEmail: "ana@example.com",
          termsAcceptedAt: "2026-11-17T18:00:00.000Z",
          locale: "en",
        },
        { subscription: "sub_test_1" }
      )
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ subscriptionId: "sub-row", emailErrors: ["quota exceeded"] });
    expect(captureMessage).toHaveBeenCalledTimes(1);
    expect(captureMessage.mock.calls[0][1]).toMatchObject({ extra: { emailErrors: ["quota exceeded"] } });
  });
});

describe("subscription lifecycle", () => {
  it.each([
    ["invoice.paid", "handleInvoicePaid"],
    ["invoice.upcoming", "handleInvoiceUpcoming"],
    ["invoice.payment_failed", "handleInvoicePaymentFailed"],
    ["customer.subscription.deleted", "handleSubscriptionDeleted"],
    ["customer.subscription.updated", "handleSubscriptionUpdated"],
  ] as const)("hands %s to its handler and answers what it returns", async (type, handler) => {
    subscriptions[handler].mockResolvedValue({ received: true, warning: "Subscription not in the database" });
    const object = { id: "obj_test_1" };

    const response = await deliver(type, object);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true, warning: "Subscription not in the database" });
    expect(subscriptions[handler]).toHaveBeenCalledTimes(1);
    expect(subscriptions[handler].mock.calls[0][0]).toEqual(object);
    for (const [name, other] of Object.entries(subscriptions)) {
      if (name !== handler) expect(other).not.toHaveBeenCalled();
    }
  });

  it("fails the delivery when a handler throws, so Stripe retries", async () => {
    subscriptions.handleInvoicePaid.mockRejectedValue(new Error("connection reset"));

    await expect(deliver("invoice.paid", { id: "in_test_1" })).rejects.toThrow("connection reset");
  });
});

describe("refunds and disputes", () => {
  it.each([
    ["charge.refunded", "handleChargeRefunded"],
    ["charge.dispute.created", "handleDisputeCreated"],
    ["charge.dispute.closed", "handleDisputeClosed"],
  ] as const)("hands %s to its handler and answers what it returns", async (type, handler) => {
    issues[handler].mockResolvedValue({ received: true, updated: true });
    const object = { id: "obj_test_1", payment_intent: "pi_test_1" };

    const response = await deliver(type, object);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true, updated: true });
    expect(issues[handler]).toHaveBeenCalledTimes(1);
    expect(issues[handler].mock.calls[0][0]).toEqual(object);
    for (const [name, other] of Object.entries(issues)) {
      if (name !== handler) expect(other).not.toHaveBeenCalled();
    }
  });

  it("answers 409 when the refund arrived before its checkout.session.completed", async () => {
    issues.handleChargeRefunded.mockResolvedValue({ received: true, retry: true, warning: "not processed yet" });

    const response = await deliver("charge.refunded", { id: "ch_test_1", payment_intent: "pi_test_1" });

    expect(response.status).toBe(409);
  });

  it("fails the delivery when a handler throws, so Stripe retries", async () => {
    issues.handleDisputeCreated.mockRejectedValue(new Error("connection reset"));

    await expect(deliver("charge.dispute.created", { id: "dp_test_1" })).rejects.toThrow("connection reset");
  });
});
