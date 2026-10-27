import { describe, expect, it } from "vitest";
import { decryptJson, encryptJson } from "./cookieCrypto";

describe("cookieCrypto", () => {
  const secret = "test-secret";

  it("round-trips a JSON payload", () => {
    const token = encryptJson({ accessToken: "act.123", openId: "abc" }, secret);
    expect(token.split(".")).toHaveLength(3);
    expect(decryptJson(token, secret)).toEqual({ accessToken: "act.123", openId: "abc" });
  });

  it("rejects a tampered token", () => {
    const token = encryptJson({ ok: true }, secret);
    const [iv, ciphertext, tag] = token.split(".");
    const flipped = ciphertext.at(0) === "A" ? "B" : "A";
    expect(decryptJson(`${iv}.${flipped}${ciphertext.slice(1)}.${tag}`, secret)).toBeNull();
  });

  it("rejects another secret and garbage", () => {
    const token = encryptJson({ ok: true }, secret);
    expect(decryptJson(token, "other-secret")).toBeNull();
    expect(decryptJson("not-a-token", secret)).toBeNull();
    expect(decryptJson("a.b", secret)).toBeNull();
  });
});
