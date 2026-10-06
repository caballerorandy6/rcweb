import { afterEach, describe, expect, it, vi } from "vitest";
import { getDbSsl } from "./dbSsl";

describe("getDbSsl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns undefined without DATABASE_CA_CERT (local development)", () => {
    vi.stubEnv("DATABASE_CA_CERT", "");
    expect(getDbSsl()).toBeUndefined();
  });

  it("pins the CA and verifies the certificate hostname", () => {
    vi.stubEnv("DATABASE_CA_CERT", "-----BEGIN CERTIFICATE-----\nabc\n-----END CERTIFICATE-----");
    const ssl = getDbSsl();
    expect(ssl?.ca).toContain("BEGIN CERTIFICATE");
    expect(typeof ssl?.checkServerIdentity).toBe("function");

    // The proxy host never matches the certificate; the internal name must.
    const cert = { subject: { CN: "postgres.railway.internal" }, subjectaltname: "DNS:postgres.railway.internal" };
    const error = ssl!.checkServerIdentity!("iriguchi.proxy.rlwy.net", cert as never);
    expect(error).toBeUndefined();

    const wrong = { subject: { CN: "other.host" }, subjectaltname: "DNS:other.host" };
    expect(ssl!.checkServerIdentity!("iriguchi.proxy.rlwy.net", wrong as never)).toBeInstanceOf(Error);
  });
});
