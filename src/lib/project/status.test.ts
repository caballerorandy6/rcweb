import { describe, expect, it } from "vitest";
import { getNextProjectStatus } from "./status";

describe("getNextProjectStatus", () => {
  const paidDeposit = { depositPaid: true, finalPaid: false };

  it("walks pending → in_progress → ready_for_payment", () => {
    expect(getNextProjectStatus("pending", paidDeposit)).toBe("in_progress");
    expect(getNextProjectStatus("in_progress", paidDeposit)).toBe("ready_for_payment");
  });

  it("never completes a project by hand: only a recorded balance does", () => {
    expect(getNextProjectStatus("ready_for_payment", paidDeposit)).toBeNull();
    expect(getNextProjectStatus("completed", paidDeposit)).toBeNull();
  });

  it("does nothing until the deposit is paid", () => {
    expect(getNextProjectStatus("pending", { depositPaid: false, finalPaid: false })).toBeNull();
  });

  it("does nothing once the balance is paid (the payment completes the project)", () => {
    expect(getNextProjectStatus("ready_for_payment", { depositPaid: true, finalPaid: true })).toBeNull();
  });
});
