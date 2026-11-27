import { afterEach, describe, expect, it, vi } from "vitest";

const { findUnique, update, create, notify, checkActionRateLimit } = vi.hoisted(() => ({
  findUnique: vi.fn(),
  update: vi.fn(),
  create: vi.fn(),
  notify: vi.fn(),
  checkActionRateLimit: vi.fn(),
}));

vi.mock("next-intl/server", () => ({ getTranslations: async () => (key: string) => key }));
vi.mock("@/lib/prisma", () => ({ prisma: { contactEmail: { findUnique }, contact: { update, create } } }));
vi.mock("@/lib/rateLimit", () => ({ checkActionRateLimit, rateLimiters: { contact: {} } }));
vi.mock("@/lib/email/senders/sendNewLeadNotification", () => ({ sendNewLeadNotification: notify }));

import { subscribeToBlogAction } from "./subscribeToBlogAction";

const subscribed = { success: true, message: "blog.subscribed" };

afterEach(() => {
  vi.resetAllMocks();
});

describe("subscribeToBlogAction", () => {
  it("stops a caller over the rate limit", async () => {
    checkActionRateLimit.mockResolvedValue({ success: false });

    expect(await subscribeToBlogAction({ email: "ana@example.com" })).toEqual({ success: false, message: "blog.tooMany" });
    expect(findUnique).not.toHaveBeenCalled();
  });

  it("adds a new address and tells the admin", async () => {
    checkActionRateLimit.mockResolvedValue({ success: true });
    findUnique.mockResolvedValueOnce(null);
    notify.mockResolvedValue(undefined);

    expect(await subscribeToBlogAction({ email: "Ana@Example.com" })).toEqual(subscribed);
    expect(create.mock.calls[0][0].data.emails).toEqual({ create: { email: "ana@example.com" } });
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it("answers the same for an address already on the list, changing nothing", async () => {
    checkActionRateLimit.mockResolvedValue({ success: true });
    findUnique.mockResolvedValueOnce({ contact: { id: "c1", marketingConsent: true } });

    expect(await subscribeToBlogAction({ email: "ana@example.com" })).toEqual(subscribed);
    expect(update).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it("turns the consent back on for a known contact without a new lead email", async () => {
    checkActionRateLimit.mockResolvedValue({ success: true });
    findUnique.mockResolvedValueOnce({ contact: { id: "c1", marketingConsent: false } });

    expect(await subscribeToBlogAction({ email: "ana@example.com" })).toEqual(subscribed);
    expect(update).toHaveBeenCalledWith({ where: { id: "c1" }, data: { marketingConsent: true } });
    expect(notify).not.toHaveBeenCalled();
  });
});
