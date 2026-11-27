import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

const { findFirst, update, send, auth, checkActionRateLimit } = vi.hoisted(() => ({
  findFirst: vi.fn(),
  update: vi.fn(),
  send: vi.fn(),
  auth: vi.fn(),
  checkActionRateLimit: vi.fn(),
}));

vi.mock("next-intl/server", () => ({ getTranslations: async () => (key: string) => key }));
vi.mock("@/lib/prisma", () => ({ prisma: { contact: { findFirst, update } } }));
vi.mock("@/lib/auth", () => ({ auth }));
vi.mock("@/lib/rateLimit", () => ({ checkActionRateLimit, rateLimiters: { contact: {} } }));
vi.mock("@/lib/projectUrl", () => ({ SITE_BASE_URL: "https://www.rcweb.dev" }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

import { unsubscribeToken } from "@/lib/unsubscribe";
import { unsubscribeFromEmailAction } from "./unsubscribeFromEmailAction";

const email = "ana@example.com";

beforeAll(() => {
  vi.stubEnv("AUTH_SECRET", "test-secret");
});

function arrange({ admin = false, limited = false } = {}) {
  checkActionRateLimit.mockResolvedValue({ success: !limited });
  auth.mockResolvedValue(admin ? { user: { role: "ADMIN" } } : null);
  send.mockResolvedValue({ error: null });
}

afterEach(() => {
  vi.resetAllMocks();
});

describe("unsubscribeFromEmailAction", () => {
  it("refuses an address without its token and touches nothing", async () => {
    arrange();

    expect(await unsubscribeFromEmailAction(email)).toEqual({ success: false, error: "unsubscribe.invalidLink" });
    expect(await unsubscribeFromEmailAction(email, unsubscribeToken("luis@example.com"))).toEqual({
      success: false,
      error: "unsubscribe.invalidLink",
    });
    expect(findFirst).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it("unsubscribes the address of a valid link and confirms by email", async () => {
    arrange();
    findFirst.mockResolvedValueOnce({ id: "c1", name: "Ana <b>", marketingConsent: true });

    expect(await unsubscribeFromEmailAction("Ana@Example.com", unsubscribeToken(email))).toEqual({ success: true });
    expect(update).toHaveBeenCalledWith({ where: { id: "c1" }, data: { marketingConsent: false } });
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][0].to).toBe(email);
    expect(send.mock.calls[0][0].html).toContain("Ana &lt;b&gt;");
  });

  it("answers the same for an unknown address, without sending anything", async () => {
    arrange();
    findFirst.mockResolvedValueOnce(null);

    expect(await unsubscribeFromEmailAction(email, unsubscribeToken(email))).toEqual({ success: true });
    expect(update).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it("does not email again someone already unsubscribed", async () => {
    arrange();
    findFirst.mockResolvedValueOnce({ id: "c1", name: "Ana", marketingConsent: false });

    expect(await unsubscribeFromEmailAction(email, unsubscribeToken(email))).toEqual({ success: true });
    expect(update).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it("lets the admin unsubscribe a contact without a token", async () => {
    arrange({ admin: true });
    findFirst.mockResolvedValueOnce({ id: "c1", name: "Ana", marketingConsent: true });

    expect(await unsubscribeFromEmailAction(email)).toEqual({ success: true });
    expect(update).toHaveBeenCalledTimes(1);
  });

  it("still succeeds when the confirmation email fails", async () => {
    arrange();
    send.mockResolvedValue({ error: { message: "quota" } });
    findFirst.mockResolvedValueOnce({ id: "c1", name: "Ana", marketingConsent: true });
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(await unsubscribeFromEmailAction(email, unsubscribeToken(email))).toEqual({ success: true });
  });

  it("stops a caller over the rate limit before anything else", async () => {
    arrange({ limited: true });

    expect(await unsubscribeFromEmailAction(email, unsubscribeToken(email))).toEqual({
      success: false,
      error: "unsubscribe.tooMany",
    });
    expect(findFirst).not.toHaveBeenCalled();
  });

  it("refuses something that is not an email address", async () => {
    arrange({ admin: true });

    expect(await unsubscribeFromEmailAction("not-an-email")).toEqual({ success: false, error: "unsubscribe.invalidLink" });
  });
});
