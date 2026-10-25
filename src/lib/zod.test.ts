import { describe, expect, it } from "vitest";
import { CheckoutRequestSchema, FormSchema, LoginSchema, QuoteInputSchema } from "./zod";

describe("FormSchema (contact form)", () => {
  const valid = {
    name: "Ana",
    email: "ana@example.com",
    phone: "3463757534",
    marketingConsent: false,
  };

  it("accepts a contact without a message", () => {
    expect(FormSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = FormSchema.safeParse({ ...valid, email: "ana@" });
    expect(result.success).toBe(false);
  });

  it("rejects a message over 500 characters", () => {
    const result = FormSchema.safeParse({ ...valid, message: "x".repeat(501) });
    expect(result.success).toBe(false);
  });

  it("requires an explicit marketing consent value", () => {
    const { name, email, phone } = valid;
    expect(FormSchema.safeParse({ name, email, phone }).success).toBe(false);
  });

  it("accepts a catalogue offer, 'not sure yet' and a preferred channel", () => {
    expect(
      FormSchema.safeParse({ ...valid, service: "admin-dashboard", preferredChannel: "whatsapp" }).success
    ).toBe(true);
    expect(FormSchema.safeParse({ ...valid, service: "" }).success).toBe(true);
  });

  it("rejects an offer or a channel outside the catalogue", () => {
    expect(FormSchema.safeParse({ ...valid, service: "free-stuff" }).success).toBe(false);
    expect(FormSchema.safeParse({ ...valid, preferredChannel: "fax" }).success).toBe(false);
  });
});

describe("CheckoutRequestSchema", () => {
  it("trims the customer name and email and lowercases the email", () => {
    const result = CheckoutRequestSchema.parse({
      planId: "starter",
      customer: { name: "  Ana  ", email: "  Ana@Example.com " },
    });
    expect(result.customer).toEqual({ name: "Ana", email: "ana@example.com" });
  });

  it("does not accept a price from the client", () => {
    const result = CheckoutRequestSchema.safeParse({
      planId: "starter",
      amount: 1,
      customer: { name: "Ana", email: "ana@example.com" },
    });
    expect(result.success).toBe(true);
    expect(result.data).not.toHaveProperty("amount");
  });
});

describe("LoginSchema", () => {
  it("requires at least 8 characters of password", () => {
    expect(
      LoginSchema.safeParse({ email: "a@b.com", password: "short" }).success
    ).toBe(false);
    expect(
      LoginSchema.safeParse({ email: "a@b.com", password: "long enough" }).success
    ).toBe(true);
  });
});

describe("QuoteInputSchema (admin quote form)", () => {
  const valid = {
    name: "Ana Pérez",
    email: " Ana@Example.com ",
    offerId: "website-redesign",
    planName: "Website Redesign for Ana's Bakery",
    scope: "- Migrate 8 pages\n\nNew design\n",
    totalDollars: "4500",
  };

  it("lowercases the email, splits the scope and coerces the total", () => {
    const result = QuoteInputSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.email).toBe("ana@example.com");
    expect(result.data.scope).toEqual(["Migrate 8 pages", "New design"]);
    expect(result.data.totalDollars).toBe(4500);
  });

  it("treats an empty contact id (hidden field) as no contact", () => {
    const result = QuoteInputSchema.safeParse({ ...valid, contactId: "" });
    expect(result.success).toBe(true);
    expect(QuoteInputSchema.safeParse({ ...valid, contactId: "not-a-uuid" }).success).toBe(false);
  });

  it("accepts a custom quote without a catalogue offer", () => {
    expect(QuoteInputSchema.safeParse({ ...valid, offerId: "" }).success).toBe(true);
    expect(QuoteInputSchema.safeParse({ ...valid, offerId: undefined }).success).toBe(true);
  });

  it("rejects an empty scope, an unknown offer and a total under $100", () => {
    expect(QuoteInputSchema.safeParse({ ...valid, scope: "\n  \n" }).success).toBe(false);
    expect(QuoteInputSchema.safeParse({ ...valid, offerId: "free-stuff" }).success).toBe(false);
    expect(QuoteInputSchema.safeParse({ ...valid, totalDollars: "99" }).success).toBe(false);
    expect(QuoteInputSchema.safeParse({ ...valid, totalDollars: "" }).success).toBe(false);
  });
});
