import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { localizedBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { getLocalizedCatalog, getLocalizedServicePages } from "@/lib/catalog";
import { offerPriceLabel, offerSlug } from "@/lib/data";
import BackLink from "@/components/ui/BackLink";

export async function generateMetadata({ params }: PageProps<"/[locale]/services">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "Services.metadata" });
  return genPageMetadata({ title: t("title"), description: t("description"), locale, pathname: "/services" });
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, common, crumbs, { offers, priceLabels }, pages] = await Promise.all([
    getTranslations("Services"),
    getTranslations("Common"),
    localizedBreadcrumbs(locale, [
      { key: "home", pathname: "/" },
      { key: "services", pathname: "/services" },
    ]),
    getLocalizedCatalog(locale),
    getLocalizedServicePages(locale),
  ]);

  // One card per offer, in catalogue order; the page copy adds the subheadline
  const cards = offers.map((offer) => ({
    offer,
    page: pages.find((p) => p.offerId === offer.id),
  }));

  return (
    <>
      <JsonLdForBreadcrumb itemList={crumbs} />

      <div className="bg-gray-950">
        <BackLink href={{ pathname: "/", hash: "services" }} label={common("backToHome")} />
        <section className="relative pt-8 pb-20 sm:pt-12 sm:pb-28">
          <div className="absolute inset-0 bg-linear-to-b from-gold/5 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl tracking-tight text-white sm:text-6xl font-iceland">
                {t("title")} <span className="text-gold">{t("titleHighlight")}</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300 font-inter">{t("intro")}</p>
            </div>

            <div className="mx-auto mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map(({ offer, page }) => (
                <Link
                  key={offer.id}
                  href={{ pathname: "/services/[slug]", params: { slug: offerSlug(offer, locale) } }}
                  className="group rounded-2xl border border-gold/20 bg-gray-900/50 p-6 lg:p-8 shadow-lg shadow-black/20 transition duration-200 hover:border-gold/50 hover:bg-gold/5"
                >
                  <offer.icon className="h-8 w-8 text-gold mb-4" />
                  <h2 className="text-2xl font-iceland text-white group-hover:text-gold transition-colors">
                    {offer.title}
                  </h2>
                  <p className="mt-3 text-gray-400 font-inter leading-7 line-clamp-3">
                    {page?.subheadline ?? offer.summary}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-inter font-semibold text-gold">
                      {offerPriceLabel(offer, priceLabels)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-inter text-gold group-hover:underline">
                      {t("learnMore")}
                      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
