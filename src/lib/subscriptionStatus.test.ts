import { describe, expect, it } from "vitest";
import type Stripe from "stripe";
import {
  cancellationReason,
  isScheduledToCancel,
  needsAuthentication,
  toSubscriptionStatus,
} from "./subscriptionStatus";

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

describe("isScheduledToCancel", () => {
  const sub = (fields: Partial<Stripe.Subscription>) =>
    ({
      cancel_at_period_end: false,
      cancel_at: null,
      ...fields,
    } as Stripe.Subscription);

  it("is true when the customer cancels at the end of the period", () => {
    expect(isScheduledToCancel(sub({ cancel_at_period_end: true }))).toBe(true);
  });

  it("is true when a custom cancel date is set", () => {
    expect(isScheduledToCancel(sub({ cancel_at: 1_800_000_000 }))).toBe(true);
  });

  it("is false for a renewing subscription or after a reactivation", () => {
    expect(isScheduledToCancel(sub({}))).toBe(false);
  });
});

describe("cancellationReason", () => {
  it("turns Stripe's feedback code into words for the admin", () => {
    expect(
      cancellationReason({ feedback: "too_expensive", comment: null })
    ).toBe("too expensive");
  });

  it("adds the customer's comment when there is one", () => {
    expect(
      cancellationReason({ feedback: "other", comment: "Closing the shop" })
    ).toBe('other: "Closing the shop"');
  });

  it("is null when the customer gave no reason", () => {
    expect(cancellationReason(null)).toBeNull();
    expect(cancellationReason({ feedback: null, comment: null })).toBeNull();
  });
});

describe("needsAuthentication", () => {
  const invoice = (...statuses: (string | null)[]) =>
    ({
      payments: {
        data: statuses.map((status) => ({
          payment: {
            type: "payment_intent",
            payment_intent: status === null ? "pi_unexpanded" : { status },
          },
        })),
      },
    } as unknown as Stripe.Invoice);

  it("is true when the bank asked the customer to confirm (3D Secure)", () => {
    expect(needsAuthentication(invoice("requires_action"))).toBe(true);
  });

  it("is false for a declined card", () => {
    expect(needsAuthentication(invoice("requires_payment_method"))).toBe(false);
  });

  it("is false when the payments were not expanded or are missing", () => {
    expect(needsAuthentication(invoice(null))).toBe(false);
    expect(needsAuthentication({} as Stripe.Invoice)).toBe(false);
  });
});
