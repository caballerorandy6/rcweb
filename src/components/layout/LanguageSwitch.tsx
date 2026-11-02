"use client";

import clsx from "clsx";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { translateServiceSlug } from "@/i18n/serviceSlugs";

type LanguageSwitchProps = {
  className?: string;
  /** Closes the drawer when used inside the mobile menu */
  onNavigate?: () => void;
};

/**
 * The EN | ES toggle. Links to the same page in the other language, with its
 * translated slug (`/about` ↔ `/es/sobre-mi`, also for each service) and its
 * query string; the URL alone carries the
 * choice, so there is no cookie and nobody is redirected automatically.
 */
export default function LanguageSwitch({ className, onNavigate }: LanguageSwitchProps) {
  const t = useTranslations("Common.languageSwitch");
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  // Links in emails carry their token or session in the query: keep it
  const query = Object.fromEntries(useSearchParams());

  return (
    <nav
      aria-label={t("label")}
      className={clsx(
        "inline-flex items-center rounded-full border border-gold/30 bg-gray-900/60 p-0.5 text-xs font-inter font-semibold uppercase tracking-wider",
        className
      )}
    >
      {routing.locales.map((target: Locale) => {
        if (target === locale) {
          return (
            <span
              key={target}
              lang={target}
              aria-current="true"
              className="rounded-full bg-gold px-2.5 py-1 text-black"
            >
              {target.toUpperCase()}
            </span>
          );
        }
        return (
          <Link
            key={target}
            // The current route's params always match its pathname template,
            // so the pair is valid by construction.
            // @ts-expect-error -- TypeScript validates params per pathname
            href={{
              pathname,
              query,
              params:
                pathname === "/services/[slug]"
                  ? { ...params, slug: translateServiceSlug(String(params.slug), target) }
                  : params,
            }}
            locale={target}
            lang={target}
            aria-label={t(target)}
            onClick={onNavigate}
            className="rounded-full px-2.5 py-1 text-white/70 transition-colors duration-200 hover:text-gold"
          >
            {target.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
