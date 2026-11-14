import { describe, expect, it } from "vitest";
import { checkoutPlans } from "@/lib/data";
import en from "@/messages/en.json";
import es from "@/messages/es.json";
import {
  maintenancePlanFeatures,
  subscriptionPlanName,
} from "./maintenancePlan";

const stored = checkoutPlans.find((p) => p.mode === "subscription")!.name;

describe("subscriptionPlanName", () => {
  it("keeps the stored English name for English customers", () => {
    expect(subscriptionPlanName(stored, "en")).toBe(stored);
  });

  it("translates the maintenance plan for Spanish customers", () => {
    expect(subscriptionPlanName(stored, "es")).toBe(
      "Mantenimiento y soporte web mensual"
    );
  });

  it("leaves names it does not know untouched", () => {
    expect(subscriptionPlanName("Legacy Plan", "es")).toBe("Legacy Plan");
  });
});

describe("maintenancePlanFeatures", () => {
  it("is the list sold on the pricing cards, in the customer's language", () => {
    expect(maintenancePlanFeatures("en")).toEqual(
      en.Catalog.offers.maintenance.features
    );
    expect(maintenancePlanFeatures("es")).toEqual(
      es.Catalog.offers.maintenance.features
    );
  });
});
