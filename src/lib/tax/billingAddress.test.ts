import { describe, expect, it } from "vitest";
import {
  BillingAddressSchema,
  formatBillingPlace,
  fromStripeAddress,
  parseStoredBillingAddress,
  toStripeAddress,
} from "./billingAddress";

const texas = {
  line1: " 123 Main St ",
  city: "Missouri City",
  state: "tx",
  postalCode: "77489",
};

describe("BillingAddressSchema", () => {
  it("trims, uppercases the state and defaults the country to US", () => {
    const result = BillingAddressSchema.safeParse(texas);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).toEqual({
      line1: "123 Main St",
      city: "Missouri City",
      state: "TX",
      postalCode: "77489",
      country: "US",
    });
  });

  it("drops an empty second line", () => {
    const result = BillingAddressSchema.safeParse({ ...texas, line2: "  " });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.line2).toBeUndefined();
  });

  it("requires a valid state and ZIP code for a US address", () => {
    expect(BillingAddressSchema.safeParse({ ...texas, state: "" }).success).toBe(false);
    expect(BillingAddressSchema.safeParse({ ...texas, state: "Texas" }).success).toBe(false);
    expect(BillingAddressSchema.safeParse({ ...texas, postalCode: "7748" }).success).toBe(false);
    expect(BillingAddressSchema.safeParse({ ...texas, postalCode: "77489-1234" }).success).toBe(true);
  });

  it("accepts a foreign address without state or ZIP code", () => {
    const result = BillingAddressSchema.safeParse({
      line1: "Calle Mayor 1",
      city: "Madrid",
      country: "es",
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.country).toBe("ES");
  });
});

describe("fromStripeAddress", () => {
  it("maps a Checkout customer address", () => {
    expect(
      fromStripeAddress({
        line1: "123 Main St",
        line2: null,
        city: "Missouri City",
        state: "TX",
        postal_code: "77489",
        country: "US",
      })
    ).toEqual({
      line1: "123 Main St",
      city: "Missouri City",
      state: "TX",
      postalCode: "77489",
      country: "US",
    });
  });

  it("returns null when there is no address or it is incomplete", () => {
    expect(fromStripeAddress(null)).toBeNull();
    expect(fromStripeAddress(undefined)).toBeNull();
    expect(
      fromStripeAddress({
        line1: null,
        line2: null,
        city: null,
        state: null,
        postal_code: null,
        country: "US",
      })
    ).toBeNull();
  });
});

describe("toStripeAddress", () => {
  it("builds the address Stripe Tax expects", () => {
    const address = BillingAddressSchema.parse({ ...texas, line2: "Suite 4" });
    expect(toStripeAddress(address)).toEqual({
      line1: "123 Main St",
      line2: "Suite 4",
      city: "Missouri City",
      state: "TX",
      postal_code: "77489",
      country: "US",
    });
  });
});

describe("parseStoredBillingAddress", () => {
  it("reads back an address saved in a Json column", () => {
    const stored = BillingAddressSchema.parse(texas);
    expect(parseStoredBillingAddress(JSON.parse(JSON.stringify(stored)))).toEqual(stored);
  });

  it("returns null for an empty or malformed value", () => {
    expect(parseStoredBillingAddress(null)).toBeNull();
    expect(parseStoredBillingAddress({ city: "Houston" })).toBeNull();
    expect(parseStoredBillingAddress("123 Main St")).toBeNull();
  });
});

describe("formatBillingPlace", () => {
  it("shows city, state and ZIP for the admin", () => {
    expect(formatBillingPlace(BillingAddressSchema.parse(texas))).toBe("Missouri City, TX 77489");
  });

  it("falls back to the country when there is no state", () => {
    expect(
      formatBillingPlace(BillingAddressSchema.parse({ line1: "Calle Mayor 1", city: "Madrid", country: "ES" }))
    ).toBe("Madrid, ES");
  });
});
