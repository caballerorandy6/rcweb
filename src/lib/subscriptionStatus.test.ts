import { describe, expect, it } from "vitest";
import type Stripe from "stripe";
import { toSubscriptionStatus } from "./subscriptionStatus";

describe("toSubscriptionStatus", () => {
  it("maps every Stripe status onto the four admin states", () => {
    const cases: Record<string, string> = {
      active: "active",
      trialing: "active",
      canceled: "cancelled",
      incomplete_expired: "cancelled",
      past_due: "past_due",
      unpaid: "unpaid",
      incomplete: "unpaid",
      paused: "unpaid",
      some_future_status: "unpaid",
    };
    for (const [stripe, expected] of Object.entries(cases)) {
      expect(toSubscriptionStatus(stripe as Stripe.Subscription.Status)).toBe(
        expected
      );
    }
  });
});
