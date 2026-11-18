import { createTranslator } from "next-intl";
import type { Locale } from "@/i18n/routing";
import en from "@/messages/en.json";
import es from "@/messages/es.json";
import { BUSINESS_TIME_ZONE } from "@/lib/company";

const MESSAGES: Record<Locale, typeof en> = { en, es };

/**
 * Copy of customer emails and invoices. They run in webhooks and actions with
 * no request locale, so the language always comes from the customer's row.
 */
export function emailTranslator(locale: Locale) {
  return createTranslator({ locale, messages: MESSAGES[locale], namespace: "Emails" });
}

/** "January 15, 2026" / "15 de enero de 2026", the day it is in Houston at that moment */
export function formatLongDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "es" ? "es-US" : "en-US", {
    timeZone: BUSINESS_TIME_ZONE,
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/** "October 2026" / "octubre de 2026", for a `@db.Date` month stored at midnight UTC */
export function formatMonth(month: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "es" ? "es-US" : "en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
  }).format(month);
}
