import { beforeEach, describe, expect, it, vi } from "vitest";

// vi.mock is hoisted above the imports, so the mocks it uses must be too
const { sessionsCreate, createInitialPaymentCheckout } = vi.hoisted(() => {
  process.env.STRIPE_MAINTENANCE_PRICE_ID = "price_test_maintenance";
  return { sessionsCreate: vi.fn(), createInitialPaymentCheckout: vi.fn() };
});

vi.mock("next-intl/server", () => ({
  getLocale: vi.fn().mockResolvedValue("en"),
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}));
vi.mock("@/lib/stripe", () => ({ default: { checkout: { sessions: { create: sessionsCreate } } } }));
vi.mock("@/lib/project/initialPaymentCheckout", () => ({ createInitialPaymentCheckout }));
vi.mock("@/lib/projectUrl", () => ({ SITE_BASE_URL: "https://example.test" }));

import { checkoutPlans } from "@/lib/data";
import { createStripeCheckoutAction } from "./createStripeCheckoutAction";

const customer = { name: "Ada Lovelace", email: "ada@example.com" };
const oneTime = checkoutPlans.find((plan) => plan.mode === "payment")!;
const monthly = checkoutPlans.find((plan) => plan.mode === "subscription")!;

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  sessionsCreate.mockResolvedValue({ url: "https://checkout.stripe.test/sub" });
  createInitialPaymentCheckout.mockResolvedValue({
    sessionUrl: "https://checkout.stripe.test/dep",
    projectCode: "QA0001",
  });
});

function expectNothingOpened() {
  expect(sessionsCreate).not.toHaveBeenCalled();
  expect(createInitialPaymentCheckout).not.toHaveBeenCalled();
}

describe("createStripeCheckoutAction: what the browser sends", () => {
  it.each([
    ["a plan that does not exist", "enterprise-suite"],
    ["an offer that is sold by quote", "business-website"],
    ["a plan name instead of its id", monthly.name],
    ["an id in another case", monthly.id.toUpperCase()],
    ["an id with something appended", `${oneTime.id}' OR 1=1`],
  ])("rejects %s without opening a session", async (_name, planId) => {
    const result = await createStripeCheckoutAction({ planId, customer });

    expect(result).toEqual({ success: false, error: "checkout.planUnavailable" });
    expectNothingOpened();
  });

  it.each([
    ["an empty plan id", { planId: "", customer }],
    ["a plan id that is not text", { planId: 42, customer }],
    ["no customer", { planId: oneTime.id }],
    ["an invalid email", { planId: oneTime.id, customer: { ...customer, email: "not-an-email" } }],
    ["a one-letter name", { planId: oneTime.id, customer: { ...customer, name: "A" } }],
  ])("rejects %s as invalid data", async (_name, request) => {
    const result = await createStripeCheckoutAction(request as never);

    expect(result).toEqual({ success: false, error: "checkout.invalid" });
    expectNothingOpened();
  });

  it("charges the catalogue price, whatever amount comes with the request", async () => {
    const result = await createStripeCheckoutAction({
      planId: oneTime.id,
      customer,
      priceInCents: 100,
      totalAmount: 100,
      mode: "subscription",
    } as never);

    expect(result).toEqual({
      success: true,
      sessionUrl: "https://checkout.stripe.test/dep",
      projectCode: "QA0001",
    });
    expect(createInitialPaymentCheckout).toHaveBeenCalledTimes(1);
    expect(createInitialPaymentCheckout.mock.calls[0][0]).toMatchObject({
      planName: oneTime.name,
      totalAmount: oneTime.priceInCents,
      customerName: customer.name,
      customerEmail: customer.email,
      locale: "en",
    });
    expect(sessionsCreate).not.toHaveBeenCalled();
  });
});

describe("createStripeCheckoutAction: monthly plan", () => {
  it("opens a subscription session with the server's price id, never an amount", async () => {
    const result = await createStripeCheckoutAction({
      planId: monthly.id,
      customer: { name: "  Ada Lovelace ", email: " Ada@Example.COM " },
      priceId: "price_from_the_browser",
    } as never);

    expect(result).toEqual({ success: true, sessionUrl: "https://checkout.stripe.test/sub" });
    expect(createInitialPaymentCheckout).not.toHaveBeenCalled();
    expect(sessionsCreate).toHaveBeenCalledTimes(1);
    const params = sessionsCreate.mock.calls[0][0];
    expect(params).toMatchObject({
      mode: "subscription",
      customer_email: "ada@example.com",
      line_items: [{ price: "price_test_maintenance", quantity: 1 }],
      automatic_tax: { enabled: true },
      allowed_payment_method_types: ["card"],
      metadata: {
        paymentType: "subscription",
        planName: monthly.name,
        customerName: "Ada Lovelace",
        customerEmail: "ada@example.com",
        locale: "en",
      },
    });
    expect(JSON.stringify(params)).not.toContain("price_from_the_browser");
    expect(Number.isNaN(Date.parse(params.metadata.termsAcceptedAt))).toBe(false);
  });

  it("answers a plain error when Stripe fails, without leaking its message", async () => {
    sessionsCreate.mockRejectedValue(new Error("No such price: 'price_test_maintenance'"));

    const result = await createStripeCheckoutAction({ planId: monthly.id, customer });

    expect(result).toEqual({ success: false, error: "checkout.failed" });
  });
});
