import Link from "next/link";
import type { Route } from "next";

import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { siteConfig } from "@/config/site";
import { offers, servicePages } from "@/lib/data";
import BackLink from "@/components/ui/BackLink";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export const metadata = genPageMetadata({
  title: "Web Development Services for Small Businesses",
  description:
    "Business websites, redesigns, admin dashboards, online stores and monthly maintenance for small businesses. Based in Houston, TX, working with clients anywhere. Free consultation.",
  pageRoute: "/services",
});

// One card per offer, in catalogue order; the page copy adds the subheadline
const cards = offers.map((offer) => ({
  offer,
  page: servicePages.find((p) => p.offerId === offer.id),
}));

export default function ServicesPage() {
  return (
    <>
      <JsonLdForBreadcrumb
        itemList={[
          { name: "Home", item: siteConfig.baseUrl },
          { name: "Services", item: `${siteConfig.baseUrl}/services` },
        ]}
      />

      <div className="bg-gray-950">
        <BackLink href="/#services" label="Back to Home" />
        <section className="relative pt-8 pb-20 sm:pt-12 sm:pb-28">
          <div className="absolute inset-0 bg-linear-to-b from-gold/5 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl tracking-tight text-white sm:text-6xl font-iceland">
                Web Development Services for{" "}
                <span className="text-gold">Small Businesses</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300 font-inter">
                Custom websites and web applications for service businesses,
                from landing pages to full-stack platforms. Built with modern
                technology, optimized for Google, available in English and
                Spanish, and delivered remotely from Houston, TX to clients
                anywhere.
              </p>
            </div>

            <div className="mx-auto mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map(({ offer, page }) => (
                <Link
                  key={offer.id}
                  href={`/services/${offer.slug}` as Route}
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
                      {offer.priceLabel}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-inter text-gold group-hover:underline">
                      Learn more
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
