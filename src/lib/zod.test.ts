import { describe, expect, it } from "vitest";
import { CheckoutRequestSchema, FormSchema, LoginSchema } from "./zod";

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
});

describe("CheckoutRequestSchema", () => {
  it("trims the customer name and email", () => {
    const result = CheckoutRequestSchema.parse({
      planId: "starter",
      customer: { name: "  Ana  ", email: "  ana@example.com " },
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
