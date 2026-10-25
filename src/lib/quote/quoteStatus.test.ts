import { describe, expect, it } from "vitest";
import {
  QUOTE_VALIDITY_DAYS,
  canAcceptQuote,
  getQuoteDisplayStatus,
  getQuoteExpiresAt,
  isQuoteOpen,
  parseScopeLines,
} from "./quoteStatus";
import { nextQuoteNumber } from "./quoteNumber";
import { splitDepositAmount } from "@/lib/project/charges";

const now = new Date("2026-10-25T12:00:00.000Z");
const future = new Date("2026-11-20T12:00:00.000Z");
const past = new Date("2026-10-01T12:00:00.000Z");

describe("quote lifecycle", () => {
  it("expires a sent quote 30 days after sending", () => {
    expect(QUOTE_VALIDITY_DAYS).toBe(30);
    expect(getQuoteExpiresAt(now)).toEqual(new Date("2026-11-24T12:00:00.000Z"));
  });

  it("derives 'expired' only for sent quotes past their expiry", () => {
    expect(getQuoteDisplayStatus({ status: "sent", expiresAt: past }, now)).toBe("expired");
    expect(getQuoteDisplayStatus({ status: "sent", expiresAt: future }, now)).toBe("sent");
    expect(getQuoteDisplayStatus({ status: "sent", expiresAt: null }, now)).toBe("sent");
    // A paid or withdrawn quote keeps its status whatever the date
    expect(getQuoteDisplayStatus({ status: "accepted", expiresAt: past }, now)).toBe("accepted");
    expect(getQuoteDisplayStatus({ status: "cancelled", expiresAt: past }, now)).toBe("cancelled");
    expect(getQuoteDisplayStatus({ status: "draft", expiresAt: null }, now)).toBe("draft");
  });

  it("treats the expiry instant itself as expired", () => {
    expect(canAcceptQuote({ status: "sent", expiresAt: now }, now)).toBe(false);
  });

  it("lets the customer accept only a sent, unexpired quote", () => {
    expect(canAcceptQuote({ status: "sent", expiresAt: future }, now)).toBe(true);
    expect(canAcceptQuote({ status: "sent", expiresAt: past }, now)).toBe(false);
    expect(canAcceptQuote({ status: "draft", expiresAt: null }, now)).toBe(false);
    expect(canAcceptQuote({ status: "accepted", expiresAt: future }, now)).toBe(false);
    expect(canAcceptQuote({ status: "cancelled", expiresAt: future }, now)).toBe(false);
  });

  it("lets the admin edit, send and cancel drafts and sent quotes only", () => {
    expect(isQuoteOpen({ status: "draft" })).toBe(true);
    expect(isQuoteOpen({ status: "sent" })).toBe(true);
    expect(isQuoteOpen({ status: "accepted" })).toBe(false);
    expect(isQuoteOpen({ status: "cancelled" })).toBe(false);
  });
});

describe("parseScopeLines", () => {
  it("splits a textarea into trimmed items and drops blank lines and bullets", () => {
    expect(parseScopeLines("- Home page\n\n  * About page  \r\n• Contact form\n   ")).toEqual([
      "Home page",
      "About page",
      "Contact form",
    ]);
  });

  it("returns an empty list for empty text", () => {
    expect(parseScopeLines("")).toEqual([]);
    expect(parseScopeLines("\n\n")).toEqual([]);
  });
});

describe("nextQuoteNumber", () => {
  it("continues the sequence within the year", () => {
    expect(nextQuoteNumber("Q-2026-007", 2026)).toBe("Q-2026-008");
    expect(nextQuoteNumber("Q-2026-999", 2026)).toBe("Q-2026-1000");
  });

  it("starts at 001 for the first quote of a year", () => {
    expect(nextQuoteNumber(null, 2026)).toBe("Q-2026-001");
    expect(nextQuoteNumber("Q-2025-042", 2026)).toBe("Q-2026-001");
  });

  it("ignores a malformed previous number", () => {
    expect(nextQuoteNumber("garbage", 2026)).toBe("Q-2026-001");
  });
});

describe("splitDepositAmount", () => {
  it("splits an even total in half", () => {
    expect(splitDepositAmount(100000)).toEqual({ deposit: 50000, balance: 50000 });
  });

  it("never loses a cent on an odd total", () => {
    const { deposit, balance } = splitDepositAmount(350001);
    expect(deposit + balance).toBe(350001);
    expect(deposit).toBe(175001);
  });
});
