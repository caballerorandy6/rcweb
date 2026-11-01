import { getLocale, getTranslations } from "next-intl/server";
import {
  buildOffer,
  certificationShapes,
  experienceShapes,
  faqValues,
  FAQ_KEYS,
  findOfferBySlug,
  offers,
  processSteps,
  projects,
  servicePageShapes,
  testimonials,
  type Offer,
  type OfferCopy,
  type PriceLabels,
  type ServicePage,
  type ServicePageCopy,
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

/** Service pages (long-form copy) in the request language */
export async function getLocalizedServicePages(locale?: Locale): Promise<ServicePage[]> {
  const resolved = locale ?? ((await getLocale()) as Locale);
  const t = await getTranslations({ locale: resolved, namespace: "Services" });
  const raw = t.raw as (path: string) => unknown;
  return servicePageShapes.map((shape) => ({
    ...shape,
    ...(raw(`pages.${shape.offerId}`) as ServicePageCopy),
  }));
}

/** Localized offer + page for a /services/[slug] URL in either language; null when unknown */
export async function getLocalizedServicePage(slug: string, locale?: Locale) {
  const base = findOfferBySlug(slug);
  if (!base) return null;
  const [{ offers: localizedOffers, priceLabels }, pages] = await Promise.all([
    getLocalizedCatalog(locale),
    getLocalizedServicePages(locale),
  ]);
  const offer = localizedOffers.find((o) => o.id === base.id)!;
  const page = pages.find((p) => p.offerId === base.id)!;
  return { offer, page, priceLabels };
}

/** Résumé entries and certifications with the copy in the request language */
export async function getLocalizedResume(locale?: Locale) {
  const resolved = locale ?? ((await getLocale()) as Locale);
  const t = await getTranslations({ locale: resolved, namespace: "About" });
  return {
    experience: experienceShapes.map((shape) => ({
      ...shape,
      title: t(`experience.items.${shape.key}.title`),
      description: t(`experience.items.${shape.key}.description`),
      date: t(`experience.items.${shape.key}.date`),
    })),
    certifications: certificationShapes.map((shape) => ({
      ...shape,
      name: t(`certifications.items.${shape.key}.name`),
      description: t(`certifications.items.${shape.key}.description`),
    })),
  };
}
