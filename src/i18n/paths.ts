import { routing, type AppPathname, type Locale } from "./routing";

type Params = Record<string, string | number>;

/**
 * Public URL path of an internal pathname in a locale, without the host:
 * `/about` → `/about` (en) or `/es/sobre-mi` (es). Pure function, usable in
 * metadata, the sitemap and tests, where next-intl's navigation helpers
 * (which need a request) are out of reach.
 */
export function localizePathname(
  pathname: AppPathname,
  locale: Locale,
  params: Params = {}
): string {
  const entry = routing.pathnames[pathname];
  const template = typeof entry === "string" ? entry : entry[locale];
  const path = template.replace(/\[(\w+)\]/g, (_, key: string) => {
    const value = params[key];
    if (value === undefined) throw new Error(`Missing param "${key}" for ${pathname}`);
    return encodeURIComponent(String(value));
  });
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  const full = `${prefix}${path}`;
  return full === "" ? "/" : full.replace(/\/$/, "") || "/";
}

/**
 * hreflang map for a page: one absolute URL per language plus `x-default`
 * pointing at English, the version shown when no language matches.
 */
export function languageAlternates(
  baseUrl: string,
  pathname: AppPathname,
  params?: Params
): Record<string, string> {
  const entries = routing.locales.map(
    (locale) => [locale, `${baseUrl}${localizePathname(pathname, locale, params)}`] as const
  );
  return {
    ...Object.fromEntries(entries),
    "x-default": `${baseUrl}${localizePathname(pathname, routing.defaultLocale, params)}`,
  };
}
