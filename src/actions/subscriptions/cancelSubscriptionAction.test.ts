import { afterEach, describe, expect, it, vi } from "vitest";
import Stripe from "stripe";

const { findUnique, cancel, captureException } = vi.hoisted(() => ({
  findUnique: vi.fn(),
  cancel: vi.fn(),
  captureException: vi.fn(),
}));

vi.mock("@sentry/nextjs", () => ({ captureException }));
vi.mock("@/lib/authGuard", () => ({ requireAdmin: async () => ({ authorized: true, userId: "admin" }) }));
vi.mock("@/lib/prisma", () => ({ prisma: { subscription: { findUnique } } }));
vi.mock("@/lib/stripe", () => ({ default: { subscriptions: { cancel } } }));

import { cancelSubscriptionAction } from "./cancelSubscriptionAction";

const id = "11111111-1111-4111-8111-111111111111";

afterEach(() => {
  vi.resetAllMocks();
});

describe("cancelSubscriptionAction", () => {
  it("cancels in Stripe and leaves the row to the webhook", async () => {
    findUnique.mockResolvedValueOnce({ stripeSubscriptionId: "sub_1", status: "active" });

    expect(await cancelSubscriptionAction(id)).toEqual({ success: true });
    expect(cancel).toHaveBeenCalledWith("sub_1");
  });

  it("does not call Stripe for a subscription that is already cancelled", async () => {
    findUnique.mockResolvedValueOnce({ stripeSubscriptionId: "sub_1", status: "cancelled" });

    expect(await cancelSubscriptionAction(id)).toEqual({
      success: false,
      error: "This subscription is already cancelled",
    });
    expect(cancel).not.toHaveBeenCalled();
  });

  it("explains a second cancellation that reaches Stripe before the webhook", async () => {
    findUnique.mockResolvedValueOnce({ stripeSubscriptionId: "sub_1", status: "active" });
    cancel.mockRejectedValueOnce(
      new Stripe.errors.StripeInvalidRequestError({
        type: "invalid_request_error",
        code: "resource_missing",
        message: "No such subscription: 'sub_1'",
      })
    );

    const result = await cancelSubscriptionAction(id);

    expect(result).toEqual({
      success: false,
      error: "Stripe already has this subscription as cancelled. Reload the page in a moment.",
    });
    expect(captureException).not.toHaveBeenCalled();
  });

  it("reports any other failure without showing Stripe's message", async () => {
    findUnique.mockResolvedValueOnce({ stripeSubscriptionId: "sub_1", status: "active" });
    cancel.mockRejectedValueOnce(new Error("Invalid API Key provided: sk_test_***"));

    const result = await cancelSubscriptionAction(id);

    expect(result.success).toBe(false);
    expect(JSON.stringify(result)).not.toContain("API Key");
    expect(captureException).toHaveBeenCalledTimes(1);
  });

  it("rejects an id that is not a uuid", async () => {
    expect(await cancelSubscriptionAction("sub_1")).toEqual({ success: false, error: "Subscription not found" });
    expect(findUnique).not.toHaveBeenCalled();
  });
});
