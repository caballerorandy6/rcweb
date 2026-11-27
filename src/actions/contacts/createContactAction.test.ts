import { afterEach, describe, expect, it, vi } from "vitest";
import en from "@/messages/en.json";

const { findFirst, update, create, auth, checkActionRateLimit, verifyRecaptcha } = vi.hoisted(() => ({
  findFirst: vi.fn(),
  update: vi.fn(),
  create: vi.fn(),
  auth: vi.fn(),
  checkActionRateLimit: vi.fn(),
  verifyRecaptcha: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getLocale: async () => "es",
  getMessages: async () => en,
  getTranslations: async () => (key: string) => key,
}));
vi.mock("@/lib/prisma", () => ({ prisma: { contact: { findFirst, update, create } } }));
vi.mock("@/lib/auth", () => ({ auth }));
vi.mock("@/lib/rateLimit", () => ({ checkActionRateLimit, rateLimiters: { contact: {} } }));
vi.mock("@/lib/recaptchaServer", () => ({ verifyRecaptcha }));
// Out of quota: the action stops after saving the contact, before any email
vi.mock("@/lib/emailQuota", () => ({
  checkAndReserveEmailQuota: async () => ({ canSend: false, message: "test" }),
  releaseEmailQuota: vi.fn(),
}));
vi.mock("@/lib/email/senders/sendContactConfirmationEmail", () => ({ sendContactConfirmationEmail: vi.fn() }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: vi.fn() };
  },
}));

import { createContactAction } from "./createContactAction";

const form = {
  name: "Ana Visitor",
  email: "ana@example.com",
  phone: "3463757534",
  message: "",
  marketingConsent: false,
  service: "" as const,
};

function arrange({ admin = false, limited = false } = {}) {
  auth.mockResolvedValue(admin ? { user: { role: "ADMIN" } } : null);
  checkActionRateLimit.mockResolvedValue({ success: !limited });
  verifyRecaptcha.mockResolvedValue(true);
  vi.spyOn(console, "warn").mockImplementation(() => {});
}

afterEach(() => {
  vi.resetAllMocks();
  vi.restoreAllMocks();
});

describe("createContactAction, visitor", () => {
  it("stops a caller over the rate limit before saving anything", async () => {
    arrange({ limited: true });

    expect(await createContactAction(form, "token", 5000)).toEqual({
      success: false,
      message: "contact.tooMany",
      errors: {},
    });
    expect(verifyRecaptcha).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });

  it("refuses a submission that does not say how long the form was open", async () => {
    arrange();

    expect((await createContactAction(form, "token")).message).toBe("contact.tooFast");
    expect((await createContactAction(form, "token", 1000)).message).toBe("contact.tooFast");
    expect(create).not.toHaveBeenCalled();
  });

  it("stores only a known source and clean UTM values", async () => {
    arrange();
    findFirst.mockResolvedValue(null);

    await createContactAction(form, "token", 5000, "manual", {
      utmSource: " google ",
      utmCampaign: "x".repeat(501),
    });
    expect(create.mock.calls[0][0].data).toMatchObject({ source: "contact_form", utmSource: null, utmCampaign: null });

    await createContactAction(form, "token", 5000, "schedule_page", { utmSource: " google ", referrer: null });
    expect(create.mock.calls[1][0].data).toMatchObject({ source: "schedule_page", utmSource: "google", referrer: null });
  });

  it("cannot rename an existing contact nor withdraw its marketing consent", async () => {
    arrange();
    findFirst.mockResolvedValueOnce({ id: "c1", name: "Real Name", marketingConsent: true, emails: [], phones: [] });

    await createContactAction({ ...form, name: "Someone Else", marketingConsent: false }, "token", 5000);

    const data = update.mock.calls[0][0].data;
    expect(data).not.toHaveProperty("name");
    expect(data).not.toHaveProperty("marketingConsent");
    expect(data.locale).toBe("es");
  });

  it("can give marketing consent to an existing contact", async () => {
    arrange();
    findFirst.mockResolvedValueOnce({ id: "c1", name: "Real Name", marketingConsent: false, emails: [], phones: [] });

    await createContactAction({ ...form, marketingConsent: true }, "token", 5000);

    expect(update.mock.calls[0][0].data.marketingConsent).toBe(true);
    expect(update.mock.calls[0][0].data).not.toHaveProperty("name");
  });
});

describe("createContactAction, admin", () => {
  it("saves a manual contact without bot checks nor rate limit", async () => {
    arrange({ admin: true });
    findFirst.mockResolvedValue(null);

    expect(await createContactAction(form, undefined, undefined, "contact_form")).toEqual({
      success: true,
      message: "Contact saved",
      errors: {},
    });
    expect(checkActionRateLimit).not.toHaveBeenCalled();
    expect(verifyRecaptcha).not.toHaveBeenCalled();
    expect(create.mock.calls[0][0].data).toMatchObject({ source: "manual", locale: "en" });
  });

  it("edits the name and consent of an existing contact", async () => {
    arrange({ admin: true });
    findFirst.mockResolvedValueOnce({ id: "c1", name: "Old", marketingConsent: true, emails: [], phones: [] });

    await createContactAction({ ...form, name: "New Name" }, undefined, undefined, "manual");

    expect(update.mock.calls[0][0].data).toMatchObject({ name: "New Name", marketingConsent: false });
  });
});
