import { describe, expect, it } from "vitest";
import { invoiceBlobPrefix, invoiceStoreCredentials } from "./blob";

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

describe("invoiceStoreCredentials", () => {
  const both = { INVOICES_READ_WRITE_TOKEN: "vercel_blob_rw_x", INVOICES_STORE_ID: "store_dev" };

  it("uses the read-write token on a machine outside Vercel", () => {
    expect(invoiceStoreCredentials(both)).toEqual({ token: "vercel_blob_rw_x" });
  });

  it("names the store for OIDC on a deployment, in preview as in production", () => {
    expect(invoiceStoreCredentials({ ...both, VERCEL: "1" })).toEqual({ storeId: "store_dev" });
    expect(invoiceStoreCredentials({ INVOICES_STORE_ID: "store_prod", VERCEL: "1" })).toEqual({
      storeId: "store_prod",
    });
  });

  it("never falls back to another store of the project", () => {
    expect(() => invoiceStoreCredentials({ BLOB_READ_WRITE_TOKEN: "vercel_blob_rw_public" })).toThrow(
      /not configured/
    );
    expect(() => invoiceStoreCredentials({ INVOICES_READ_WRITE_TOKEN: " ", INVOICES_STORE_ID: "" })).toThrow(
      /not configured/
    );
  });
});
