import { afterEach, describe, expect, it, vi } from "vitest";

const { updateMany, load, send } = vi.hoisted(() => ({
  updateMany: vi.fn(),
  load: vi.fn(),
  send: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/authGuard", () => ({ requireAdmin: async () => ({ authorized: true, userId: "admin" }) }));
vi.mock("@/lib/prisma", () => ({ prisma: { maintenanceReport: { updateMany } } }));
vi.mock("@/lib/maintenanceReport/loadEmail", () => ({ loadMaintenanceReportEmail: load }));
vi.mock("@/lib/email/senders/sendMaintenanceReportEmail", () => ({ sendMaintenanceReportEmail: send }));

import { sendMaintenanceReportAction } from "./sendMaintenanceReportAction";

const id = "11111111-1111-4111-8111-111111111111";
const loaded = { subscriptionId: "sub", customerEmail: "ana@x.test", status: "sent", email: { locale: "en" } };

afterEach(() => {
  vi.clearAllMocks();
});

describe("sendMaintenanceReportAction", () => {
  it("claims the draft, then emails it", async () => {
    updateMany.mockResolvedValueOnce({ count: 1 });
    load.mockResolvedValueOnce(loaded);
    send.mockResolvedValueOnce({ success: true });

    expect(await sendMaintenanceReportAction(id)).toEqual({ success: true });
    expect(updateMany).toHaveBeenCalledTimes(1);
    expect(updateMany.mock.calls[0][0]).toMatchObject({
      where: { id, status: "draft" },
      data: { status: "sent" },
    });
    expect(send).toHaveBeenCalledWith({ customerEmail: "ana@x.test", locale: "en" });
  });

  it("never emails a report that was already sent", async () => {
    updateMany.mockResolvedValueOnce({ count: 0 });

    expect(await sendMaintenanceReportAction(id)).toEqual({
      success: false,
      error: "This report was already sent",
    });
    expect(send).not.toHaveBeenCalled();
  });

  it("puts the report back to draft when the email fails", async () => {
    updateMany.mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 1 });
    load.mockResolvedValueOnce(loaded);
    send.mockResolvedValueOnce({ success: false, error: "Quota exceeded" });

    expect(await sendMaintenanceReportAction(id)).toEqual({ success: false, error: "Quota exceeded" });
    const sentAt = updateMany.mock.calls[0][0].data.sentAt;
    expect(updateMany.mock.calls[1][0]).toEqual({
      where: { id, status: "sent", sentAt },
      data: { status: "draft", sentAt: null },
    });
  });

  it("rejects an id that is not a uuid", async () => {
    expect(await sendMaintenanceReportAction("nope")).toEqual({ success: false, error: "Invalid report" });
    expect(updateMany).not.toHaveBeenCalled();
  });
});
