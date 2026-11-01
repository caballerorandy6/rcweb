import { siteConfig } from "@/config/site";
import { localizePathname } from "@/i18n/paths";
import { routing, type Locale } from "@/i18n/routing";

export const SITE_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || siteConfig.baseUrl;

/** Public progress page for a project; the token is the only credential. */
export function getProjectUrl(accessToken: string, locale: Locale = routing.defaultLocale): string {
  return `${SITE_BASE_URL}${localizePathname("/project/[accessToken]", locale, { accessToken })}`;
}

/** Magic link that sends the customer straight to the final-payment Checkout. */
export function getPayUrl(accessToken: string, locale: Locale = routing.defaultLocale): string {
  return `${SITE_BASE_URL}${localizePathname("/pay/[token]", locale, { token: accessToken })}`;
}

/** Public quote page; the token is the only credential. */
export function getQuoteUrl(token: string, locale: Locale = routing.defaultLocale): string {
  return `${SITE_BASE_URL}${localizePathname("/quote/[token]", locale, { token })}`;
}
