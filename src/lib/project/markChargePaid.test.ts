import { beforeEach, describe, expect, it, vi } from "vitest";

// vi.mock is hoisted above the imports, so the mocks it uses must be too
const { tx } = vi.hoisted(() => ({
  tx: { payment: { updateMany: vi.fn() }, project: { update: vi.fn() } },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: { $transaction: (run: (client: typeof tx) => unknown) => run(tx) },
}));

import { markChargePaid } from "./markChargePaid";

const paidAt = new Date("2026-11-17T12:00:00.000Z");

beforeEach(() => {
  vi.clearAllMocks();
  tx.payment.updateMany.mockResolvedValue({ count: 1 });
});

describe("markChargePaid", () => {
  it("marks the charge paid only while it is pending", async () => {
    const won = await markChargePaid({
      projectId: "p1",
      chargeId: "c1",
      charge: { paidAt, method: "zelle", taxAmount: 660 },
    });

    expect(won).toBe(true);
    expect(tx.payment.updateMany).toHaveBeenCalledWith({
      where: { id: "c1", projectId: "p1", status: "pending" },
      data: { paidAt, method: "zelle", taxAmount: 660, status: "paid" },
    });
    expect(tx.project.update).not.toHaveBeenCalled();
  });

  it("updates the project in the same transaction when it wins", async () => {
    await markChargePaid({
      projectId: "p1",
      chargeId: "c1",
      charge: { paidAt },
      project: { status: "completed" },
    });

    expect(tx.project.update).toHaveBeenCalledWith({
      where: { id: "p1" },
      data: { status: "completed" },
    });
  });

  it("leaves the project alone when someone else already marked it paid", async () => {
    tx.payment.updateMany.mockResolvedValue({ count: 0 });

    const won = await markChargePaid({
      projectId: "p1",
      chargeId: "c1",
      charge: { paidAt },
      project: { status: "completed" },
    });

    expect(won).toBe(false);
    expect(tx.project.update).not.toHaveBeenCalled();
  });
});
