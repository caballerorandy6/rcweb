import { describe, expect, it } from "vitest";
import { invoiceBlobPrefix } from "./blob";

describe("invoiceBlobPrefix", () => {
  it("writes production invoices at the root folder", () => {
    expect(invoiceBlobPrefix("production")).toBe("invoices/");
  });

  it("isolates preview deployments in their own folder", () => {
    expect(invoiceBlobPrefix("preview")).toBe("preview/invoices/");
  });

  it("isolates local development when VERCEL_ENV is not set", () => {
    expect(invoiceBlobPrefix(undefined)).toBe("dev/invoices/");
    expect(invoiceBlobPrefix("")).toBe("dev/invoices/");
  });
});
