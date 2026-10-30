import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/**
 * Per-request i18n config. The locale comes from the `[locale]` segment;
 * anything unsupported falls back to English (the layout already 404s it).
 * Messages are loaded on the server only; client components get the slice
 * the layout hands to NextIntlClientProvider.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: "America/Chicago",
  };
});
