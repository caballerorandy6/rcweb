import { beforeEach, describe, expect, it, vi } from "vitest";

// vi.mock is hoisted above the imports, so the mocks it uses must be too
const { findUnique, updateMany, sendProjectReadyEmail } = vi.hoisted(() => ({
  findUnique: vi.fn(),
  updateMany: vi.fn(),
  sendProjectReadyEmail: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({ prisma: { project: { findUnique, updateMany } } }));
vi.mock("@/lib/authGuard", () => ({
  requireAdmin: vi.fn().mockResolvedValue({ authorized: true, userId: "admin" }),
}));
vi.mock("@/lib/email/senders", () => ({ sendProjectReadyEmail }));
vi.mock("@/lib/projectUrl", () => ({ getPayUrl: (token: string) => `https://site.test/pay/${token}` }));
vi.mock("resend", () => ({ Resend: vi.fn() }));

import { updateProjectStatusAction } from "./updateProjectStatusAction";

function project(status: string, deposit = "paid", final = "pending") {
  return {
    id: "proj-1",
    projectCode: "AB3K9Z",
    planName: "Business Website",
    name: "Ana",
    email: "ana@example.com",
    locale: "en",
    accessToken: "tok",
    status,
    payments: [
      { id: "dep", kind: "deposit", status: deposit, amount: 100_000 },
      { id: "fin", kind: "final", status: final, amount: 100_000 },
    ],
  };
}

const REFUSED = { success: false, error: "The project cannot move to that status from where it is now" };

beforeEach(() => {
  vi.clearAllMocks();
  updateMany.mockResolvedValue({ count: 1 });
  sendProjectReadyEmail.mockResolvedValue({ success: true });
});

describe("updateProjectStatusAction", () => {
  it("starts a pending project whose deposit is paid", async () => {
    findUnique.mockResolvedValue(project("pending"));

    const result = await updateProjectStatusAction("AB3K9Z", "in_progress");

    expect(result.success).toBe(true);
    expect(updateMany).toHaveBeenCalledWith({
      where: { id: "proj-1", status: "pending" },
      data: { status: "in_progress" },
    });
    expect(sendProjectReadyEmail).not.toHaveBeenCalled();
  });

  it("marks a project in progress as ready and emails the payment link", async () => {
    findUnique.mockResolvedValue(project("in_progress"));

    const result = await updateProjectStatusAction("AB3K9Z", "ready_for_payment");

    expect(result).toEqual({
      success: true,
      data: {
        project: { id: "proj-1", projectCode: "AB3K9Z", planName: "Business Website", status: "ready_for_payment" },
        emailError: undefined,
      },
    });
    expect(sendProjectReadyEmail).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ customerEmail: "ana@example.com", finalAmount: 100_000, paymentUrl: "https://site.test/pay/tok" })
    );
  });

  it("does not skip a step", async () => {
    findUnique.mockResolvedValue(project("pending"));

    expect(await updateProjectStatusAction("AB3K9Z", "ready_for_payment")).toEqual(REFUSED);
    expect(updateMany).not.toHaveBeenCalled();
    expect(sendProjectReadyEmail).not.toHaveBeenCalled();
  });

  it("does not go back or repeat the current status", async () => {
    findUnique.mockResolvedValue(project("ready_for_payment"));

    expect(await updateProjectStatusAction("AB3K9Z", "in_progress")).toEqual(REFUSED);
    expect(await updateProjectStatusAction("AB3K9Z", "ready_for_payment")).toEqual(REFUSED);
    expect(sendProjectReadyEmail).not.toHaveBeenCalled();
  });

  it("does not reopen a completed project", async () => {
    findUnique.mockResolvedValue(project("completed", "paid", "paid"));

    expect(await updateProjectStatusAction("AB3K9Z", "in_progress")).toEqual(REFUSED);
    expect(updateMany).not.toHaveBeenCalled();
  });

  it("does not start a project whose deposit is not paid or was refunded", async () => {
    for (const deposit of ["pending", "refunded"]) {
      findUnique.mockResolvedValue(project("pending", deposit));
      expect(await updateProjectStatusAction("AB3K9Z", "in_progress")).toEqual(REFUSED);
    }
    expect(updateMany).not.toHaveBeenCalled();
  });

  it("never completes a project by hand", async () => {
    const result = await updateProjectStatusAction("AB3K9Z", "completed");

    expect(result).toEqual({ success: false, error: "Record the final payment to complete the project" });
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("lets only one of two simultaneous clicks through", async () => {
    findUnique.mockResolvedValue(project("in_progress"));
    updateMany.mockResolvedValue({ count: 0 });

    const result = await updateProjectStatusAction("AB3K9Z", "ready_for_payment");

    expect(result).toEqual({ success: false, error: "The project status has just changed. Reload the page" });
    expect(sendProjectReadyEmail).not.toHaveBeenCalled();
  });
});
