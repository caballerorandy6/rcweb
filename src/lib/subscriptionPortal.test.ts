import { describe, expect, it } from "vitest";
import { portalSubscriptions } from "./subscriptionPortal";

const row = (id: string, status: "active" | "past_due" | "cancelled", stripeCustomerId = `cus_${id}`) => ({
  id,
  status,
  stripeCustomerId,
});

describe("portalSubscriptions", () => {
  it("has nothing to link without a subscription", () => {
    expect(portalSubscriptions([])).toEqual([]);
  });

  it("links every subscription that is still alive, newest first", () => {
    const rows = [row("c", "active"), row("b", "cancelled"), row("a", "past_due")];
    expect(portalSubscriptions(rows).map((r) => r.id)).toEqual(["c", "a"]);
  });

  it("links the latest one when all of them ended, for its billing history", () => {
    const rows = [row("b", "cancelled"), row("a", "cancelled")];
    expect(portalSubscriptions(rows).map((r) => r.id)).toEqual(["b"]);
  });

  it("links a Stripe customer once", () => {
    const rows = [row("b", "active", "cus_same"), row("a", "active", "cus_same")];
    expect(portalSubscriptions(rows).map((r) => r.id)).toEqual(["b"]);
  });
});
