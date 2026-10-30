import { getLocale, getTranslations } from "next-intl/server";
import {
  buildOffer,
  faqValues,
  FAQ_KEYS,
  offers,
  processSteps,
  projects,
  testimonials,
  type Offer,
  type OfferCopy,
  type PriceLabels,
} from "@/lib/data";
import type { Locale } from "@/i18n/routing";

type CatalogTranslator = Awaited<ReturnType<typeof getTranslations<"Catalog">>>;

function offerCopyFrom(t: CatalogTranslator, id: Offer["id"]): OfferCopy {
  const k = (field: string) => `offers.${id}.${field}` as const;
  return {
    title: t(k("title")),
    summary: t(k("summary")),
    tags: t.raw(k("tags")) as string[],
    highlight: t(k("highlight")),
    range: t(k("range")),
    duration: t(k("duration")),
    description: t(k("description")),
    features: t.raw(k("features")) as string[],
    ideal: t(k("ideal")),
    ...(t.has(k("checkoutCta")) && { checkoutCta: t(k("checkoutCta")) }),
    ...(t.has(k("quoteCta")) && { quoteCta: t(k("quoteCta")) }),
  };
}

/**
 * The catalogue in the language of the current request. Same ids, slugs,
 * prices and icons as `lib/data`; only the copy changes. Server-only: pages
 * and sections call it and hand plain strings to any client island.
 */
export async function getLocalizedCatalog(locale?: Locale) {
  const resolved = locale ?? ((await getLocale()) as Locale);
  const t = await getTranslations({ locale: resolved, namespace: "Catalog" });

  const priceLabels: PriceLabels = { from: t("priceFrom"), perMonth: t("perMonth") };

  const localizedOffers = offers.map((offer) =>
    buildOffer(
      { ...offer, checkout: offer.checkout && { ...offer.checkout } },
      offerCopyFrom(t, offer.id)
    )
  );

  const values = faqValues(
    localizedOffers,
    (title, days) => t("faqs.supportItem", { title, days }),
    priceLabels
  );
  const faqs = FAQ_KEYS.map((key) => ({
    key,
    question: t(`faqs.${key}.question`),
    answer: t(`faqs.${key}.answer`, values),
  }));

  return {
    locale: resolved,
    priceLabels,
    offers: localizedOffers,
    faqs,
    processSteps: processSteps.map((step) => ({
      ...step,
      title: t(`process.${step.key}.title`),
      week: t(`process.${step.key}.week`),
      description: t(`process.${step.key}.description`),
      details: t.raw(`process.${step.key}.details`) as string[],
    })),
    projects: projects.map((project) => ({
      ...project,
      description: t(`projects.${project.id}`),
    })),
    testimonials: testimonials.map((item) => ({
      ...item,
      content: t(`testimonials.${item.key}.content`),
      highlight: t(`testimonials.${item.key}.highlight`),
    })),
  };
}

export type LocalizedCatalog = Awaited<ReturnType<typeof getLocalizedCatalog>>;
