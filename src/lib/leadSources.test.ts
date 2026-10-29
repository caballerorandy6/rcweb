import { describe, expect, it } from "vitest";
import {
  leadSourceColor,
  leadSourceLabel,
  normalizeLeadSource,
  utmSourceColor,
} from "./leadSources";

describe("normalizeLeadSource", () => {
  it("lowercases legacy uppercase sources", () => {
    expect(normalizeLeadSource("SMS_OPT_IN")).toBe("sms_opt_in");
  });

  it("treats null, undefined and blank as unknown", () => {
    expect(normalizeLeadSource(null)).toBe("unknown");
    expect(normalizeLeadSource(undefined)).toBe("unknown");
    expect(normalizeLeadSource("  ")).toBe("unknown");
  });
});

describe("leadSourceLabel", () => {
  it("returns the human label for a known source, whatever the case", () => {
    expect(leadSourceLabel("contact_form")).toBe("Contact form");
    expect(leadSourceLabel("SMS_OPT_IN")).toBe("SMS opt-in");
  });

  it("falls back to the key with spaces for an unknown source", () => {
    expect(leadSourceLabel("partner_referral")).toBe("partner referral");
    expect(leadSourceLabel(null)).toBe("Unknown");
  });
});

describe("colours", () => {
  it("shares one colour for a source and its legacy spelling", () => {
    expect(leadSourceColor("sms_opt_in")).toBe(leadSourceColor("SMS_OPT_IN"));
  });

  it("falls back to grey for unknown sources and networks", () => {
    expect(leadSourceColor("something_new")).toBe("#9CA3AF");
    expect(utmSourceColor("Google")).toBe("#4285F4");
    expect(utmSourceColor("pigeon")).toBe("#9CA3AF");
  });
});
