import { describe, expect, it } from "vitest";
import { buildMaintenanceReportEmail } from "./email";
import { checkoutPlans } from "@/lib/data";

const maintenancePlan = checkoutPlans.find((p) => p.mode === "subscription")!.name;

const row = {
  month: new Date("2026-10-01T00:00:00Z"),
  errorsResolved: 2,
  updatesApplied: null,
  backupsVerified: false,
  uptimePercent: { toNumber: () => 99.9 },
  visitors: 10,
  pageViews: 30,
  notes: "  ",
  subscription: { name: "Ana", locale: "es" as const, planName: maintenancePlan },
};

describe("buildMaintenanceReportEmail", () => {
  it("adds up the month's work log against the included hours", () => {
    expect(buildMaintenanceReportEmail(row, [60, 90]).hours).toEqual({ used: 150, included: 120, extra: 30 });
  });

  it("names the plan in the customer's language and unwraps the Decimal", () => {
    const email = buildMaintenanceReportEmail(row, []);
    expect(email.planName).toBe("Mantenimiento y soporte web mensual");
    expect(email.uptimePercent).toBe(99.9);
    expect(email.locale).toBe("es");
    expect(email.updatesApplied).toBeNull();
  });

  it("drops blank notes", () => {
    expect(buildMaintenanceReportEmail(row, []).notes).toBeNull();
    expect(buildMaintenanceReportEmail({ ...row, notes: " Hola " }, []).notes).toBe("Hola");
  });
});
