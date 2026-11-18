import { beforeEach, describe, expect, it, vi } from "vitest";

// vi.mock is hoisted above the imports, so the mocks it uses must be too
const { findFirst } = vi.hoisted(() => ({ findFirst: vi.fn() }));

vi.mock("@/lib/prisma", () => ({ prisma: { project: { findFirst } } }));
vi.mock("@/lib/rateLimit", () => ({
  rateLimiters: { contact: {} },
  checkActionRateLimit: vi.fn().mockResolvedValue({ success: true }),
}));
vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn().mockResolvedValue((key: string) => key),
}));

import { verifyProjectAccessAction } from "./verifyProjectAccessAction";

function project(status: string, deposit = "paid", final = "pending") {
  return {
    id: "proj-1",
    projectCode: "AB3K9Z",
    planName: "Business Website",
    email: "ana@example.com",
    accessToken: "tok",
    status,
    payments: [
      { id: "dep", kind: "deposit", status: deposit, amount: 100_000 },
      { id: "fin", kind: "final", status: final, amount: 100_050 },
    ],
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("verifyProjectAccessAction", () => {
  it("looks the project up by lowercased email and uppercased code", async () => {
    findFirst.mockResolvedValue(project("ready_for_payment"));

    const result = await verifyProjectAccessAction(" Ana@Example.com ", " ab3k9z ");

    expect(findFirst).toHaveBeenCalledWith({
      where: { email: "ana@example.com", projectCode: "AB3K9Z" },
      include: { payments: true },
    });
    expect(result).toEqual({
      success: true,
      data: {
        project: {
          id: "proj-1",
          projectCode: "AB3K9Z",
          planName: "Business Website",
          email: "ana@example.com",
          finalAmount: 100_050,
          accessToken: "tok",
        },
      },
    });
  });

  it("does not tell an unknown email or code apart", async () => {
    findFirst.mockResolvedValue(null);
    expect(await verifyProjectAccessAction("x@example.com", "ZZZZZZ")).toEqual({
      success: false,
      error: "project.invalidCredentials",
    });
  });

  it("refuses a project whose deposit is not paid", async () => {
    findFirst.mockResolvedValue(project("ready_for_payment", "pending"));
    expect(await verifyProjectAccessAction("ana@example.com", "AB3K9Z")).toEqual({
      success: false,
      error: "project.depositPending",
    });
  });

  it("refuses a project still in progress", async () => {
    findFirst.mockResolvedValue(project("in_progress"));
    expect(await verifyProjectAccessAction("ana@example.com", "AB3K9Z")).toEqual({
      success: false,
      error: "project.notReady",
    });
  });

  it.each(["paid", "refunded"])("tells a customer whose balance is %s that nothing is due", async (final) => {
    findFirst.mockResolvedValue(project("completed", "paid", final));
    expect(await verifyProjectAccessAction("ana@example.com", "AB3K9Z")).toEqual({
      success: false,
      error: "project.alreadyPaid",
    });
  });
});
