import { createHmac, timingSafeEqual } from "node:crypto";
import { localizePathname } from "@/i18n/paths";
import type { Locale } from "@/i18n/routing";
import { SITE_BASE_URL } from "@/lib/projectUrl";

// The unsubscribe link of an email carries the address and a signature of it,
// so only someone who received that email can unsubscribe that address.

/** Marker a campaign's HTML uses where each recipient's own link goes */
export const UNSUBSCRIBE_PLACEHOLDER = "{{unsubscribe_url}}";

function secret(): string {
  const value = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!value) throw new Error("AUTH_SECRET is not set");
  return value;
}

const normalize = (email: string) => email.trim().toLowerCase();

export function unsubscribeToken(email: string): string {
  return createHmac("sha256", secret()).update(`unsubscribe:${normalize(email)}`).digest("base64url");
}

export function isValidUnsubscribeToken(email: string, token: string | null | undefined): boolean {
  if (!token) return false;
  const expected = Buffer.from(unsubscribeToken(email));
  const received = Buffer.from(token);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function unsubscribeUrl(email: string, locale: Locale = "en"): string {
  const query = new URLSearchParams({ email: normalize(email), token: unsubscribeToken(email) });
  return `${SITE_BASE_URL}${localizePathname("/unsubscribe", locale)}?${query}`;
}

/**
 * A campaign's HTML for one recipient: the placeholder becomes their link,
 * and a campaign written without it gets the link appended, so no marketing
 * email goes out without a working way to unsubscribe.
 */
export function withUnsubscribeLink(html: string, email: string, locale: Locale = "en"): string {
  const url = unsubscribeUrl(email, locale);
  if (html.includes(UNSUBSCRIBE_PLACEHOLDER)) return html.replaceAll(UNSUBSCRIBE_PLACEHOLDER, url);
  const footer = `<p style="margin:24px 0;text-align:center;font-size:12px;color:#666">Don't want to receive these emails? <a href="${url}" style="color:#888">Unsubscribe</a></p>`;
  const end = html.lastIndexOf("</body>");
  return end === -1 ? html + footer : html.slice(0, end) + footer + html.slice(end);
}
