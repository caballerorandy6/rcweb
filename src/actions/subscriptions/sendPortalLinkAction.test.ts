import { afterEach, describe, expect, it, vi } from "vitest";

const { findMany, update, send } = vi.hoisted(() => {
  process.env.NEXT_PUBLIC_BASE_URL = "https://www.rcweb.dev";
  return { findMany: vi.fn(), update: vi.fn(), send: vi.fn() };
});

vi.mock("next-intl/server", () => ({
  getLocale: async () => "en",
  getTranslations: async () => (key: string) => key,
}));
vi.mock("resend", () => ({ Resend: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { subscription: { findMany, update } } }));
vi.mock("@/lib/rateLimit", () => ({
  rateLimiters: { contact: {} },
  checkActionRateLimit: async () => ({ success: true }),
}));
vi.mock("@/lib/email/senders", () => ({ sendSubscriptionPortalLink: send }));

import { sendPortalLinkAction } from "./sendPortalLinkAction";

const row = (id: string, status: string, createdAt: string) => ({
  id,
  email: "ana@example.com",
  name: "Ana Pérez",
  planName: "Care Plan",
  status,
  stripeCustomerId: `cus_${id}`,
  createdAt: new Date(createdAt),
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("sendPortalLinkAction", () => {
  it("answers the same and sends nothing for an email without a subscription", async () => {
    findMany.mockResolvedValueOnce([]);

    expect(await sendPortalLinkAction("nobody@example.com")).toEqual({ success: true });
    expect(update).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it("looks the email up in lower case", async () => {
    findMany.mockResolvedValueOnce([]);

    await sendPortalLinkAction("Ana@Example.com");
    expect(findMany.mock.calls[0][0].where).toEqual({ email: "ana@example.com" });
  });

  it("sends one email with a link to each live subscription, each with its own token", async () => {
    findMany.mockResolvedValueOnce([
      row("new", "active", "2026-11-20T12:00:00Z"),
      row("gone", "cancelled", "2026-09-01T12:00:00Z"),
      row("old", "past_due", "2026-08-02T12:00:00Z"),
    ]);
    update.mockResolvedValue({});
    send.mockResolvedValueOnce({ success: true });

    expect(await sendPortalLinkAction("ana@example.com")).toEqual({ success: true });

    expect(update.mock.calls.map(([args]) => args.where.id)).toEqual(["new", "old"]);
    const tokens = update.mock.calls.map(([args]) => args.data.portalToken as string);
    expect(new Set(tokens).size).toBe(2);
    for (const token of tokens) expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);

    expect(send).toHaveBeenCalledTimes(1);
    const { customerEmail, links } = send.mock.calls[0][1];
    expect(customerEmail).toBe("ana@example.com");
    expect(links).toEqual([
      {
        planName: "Care Plan",
        startedAt: new Date("2026-11-20T12:00:00Z"),
        portalUrl: `https://www.rcweb.dev/manage-subscription/${tokens[0]}`,
      },
      {
        planName: "Care Plan",
        startedAt: new Date("2026-08-02T12:00:00Z"),
        portalUrl: `https://www.rcweb.dev/manage-subscription/${tokens[1]}`,
      },
    ]);
  });

  it("reports an email that could not be sent", async () => {
    findMany.mockResolvedValueOnce([row("new", "active", "2026-11-20T12:00:00Z")]);
    update.mockResolvedValue({});
    send.mockResolvedValueOnce({ success: false, error: "quota exceeded" });

    expect(await sendPortalLinkAction("ana@example.com")).toEqual({
      success: false,
      error: "portal.emailFailed",
    });
  });
});
