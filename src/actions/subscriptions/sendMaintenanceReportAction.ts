"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/authGuard";
import { prisma } from "@/lib/prisma";
import { loadMaintenanceReportEmail } from "@/lib/maintenanceReport/loadEmail";
import { sendMaintenanceReportEmail } from "@/lib/email/senders/sendMaintenanceReportEmail";
import type { ActionResultSimple } from "@/types/common";

/**
 * Emails a draft report to the customer and marks it sent. The report is
 * claimed first (draft → sent in one update), so a double click or two open
 * tabs never send it twice; if the email fails it goes back to draft.
 */
export async function sendMaintenanceReportAction(id: string): Promise<ActionResultSimple> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return { success: false, error: authCheck.error };
  }

  const parsed = z.uuid().safeParse(id);
  if (!parsed.success) {
    return { success: false, error: "Invalid report" };
  }

  const sentAt = new Date();
  const { count: claimed } = await prisma.maintenanceReport.updateMany({
    where: { id: parsed.data, status: "draft" },
    data: { status: "sent", sentAt },
  });
  if (claimed === 0) {
    return { success: false, error: "This report was already sent" };
  }

  let error: string | undefined;
  let subscriptionId: string | undefined;
  try {
    const report = await loadMaintenanceReportEmail(parsed.data);
    if (!report) throw new Error("Report not found");
    subscriptionId = report.subscriptionId;

    const sent = await sendMaintenanceReportEmail({ customerEmail: report.customerEmail, ...report.email });
    if (!sent.success) error = sent.error ?? "Email could not be sent";
  } catch (e) {
    console.error("Error sending a maintenance report:", e);
    error = "Failed to send the report";
  }

  if (error) {
    // Back to draft so it can be fixed and sent again
    await prisma.maintenanceReport.updateMany({
      where: { id: parsed.data, status: "sent", sentAt },
      data: { status: "draft", sentAt: null },
    });
  }
  if (subscriptionId) revalidatePath(`/subscriptions/${subscriptionId}`);

  return error ? { success: false, error } : { success: true };
}
