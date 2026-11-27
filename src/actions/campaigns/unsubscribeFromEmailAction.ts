"use server";

import { getTranslations } from "next-intl/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { auth } from "@/lib/auth";
import { checkActionRateLimit, rateLimiters } from "@/lib/rateLimit";
import { escapeHtml } from "@/lib/sanitize";
import { isValidUnsubscribeToken } from "@/lib/unsubscribe";
import type { ActionResultSimple } from "@/types/common";

const resend = new Resend(process.env.RESEND_API_KEY!);

const EmailSchema = z.string().trim().toLowerCase().pipe(z.email().max(254));

/**
 * Stops marketing emails to an address. The caller proves the address is
 * theirs with the signed token of the link in our emails; the admin can do it
 * for anyone from the contact list. The answer never tells whether the
 * address is in the database.
 */
export async function unsubscribeFromEmailAction(
  email: string,
  token?: string | null
): Promise<ActionResultSimple> {
  const t = await getTranslations("Actions");
  try {
    const rateCheck = await checkActionRateLimit(rateLimiters.contact);
    if (!rateCheck.success) {
      return { success: false, error: t("unsubscribe.tooMany") };
    }

    const parsed = EmailSchema.safeParse(email);
    if (!parsed.success) {
      return { success: false, error: t("unsubscribe.invalidLink") };
    }
    const address = parsed.data;

    const allowed =
      isValidUnsubscribeToken(address, typeof token === "string" ? token : null) ||
      (await auth())?.user?.role === "ADMIN";
    if (!allowed) {
      return { success: false, error: t("unsubscribe.invalidLink") };
    }

    const contact = await prisma.contact.findFirst({
      where: { emails: { some: { email: address } } },
      select: { id: true, name: true, marketingConsent: true },
    });

    // Unknown or already unsubscribed: nothing to change, nothing to send
    if (!contact || !contact.marketingConsent) {
      return { success: true };
    }

    await prisma.contact.update({
      where: { id: contact.id },
      data: { marketingConsent: false },
    });

    // The confirmation is a courtesy: the unsubscribe already happened
    const { error: sendError } = await resend.emails.send({
      from: "RC Web Solutions <no-reply@rcweb.dev>",
      to: address,
      subject: "You've unsubscribed from our emails",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; background: #f9fafb; padding: 24px; border-radius: 12px;">
          <h1 style="text-align: center; color: #ef4444;">Unsubscribed Successfully</h1>
          <p style="color: #374151;">Hi ${escapeHtml(contact.name || "")},</p>
          <p style="color: #374151;">You have successfully unsubscribed <strong>${escapeHtml(address)}</strong> from our marketing emails. You will no longer receive promotions, newsletters, or offers from RC Web.</p>
          <p style="color: #6b7280; font-size: 14px;">Note: You may still receive transactional emails related to your active projects or payments.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
          <p style="text-align: center; color: #6b7280; font-size: 12px;">
            Changed your mind? <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="color: #7c3aed;">Visit our site</a> to resubscribe anytime.
          </p>
        </div>
      `,
    });
    if (sendError) console.error("Unsubscribe confirmation not sent:", sendError.message);

    return { success: true };
  } catch (error) {
    console.error("Error unsubscribing:", error);
    return { success: false, error: t("unsubscribe.failed") };
  }
}
