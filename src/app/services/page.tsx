import Link from "next/link";
import type { Route } from "next";

import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { siteConfig } from "@/config/site";
import { servicePages } from "@/lib/data";
import BackLink from "@/components/ui/BackLink";
import {
  ArrowRightIcon,
  GlobeAltIcon,
  CodeBracketIcon,
  ChatBubbleLeftRightIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export const metadata = genPageMetadata({
  title: "Web Development Services Houston TX | RC Web Solutions",
  description:
    "Professional web development services in Houston, TX. Web design, Next.js development, bilingual websites, e-commerce, and local SEO. Free consultation.",
  pageRoute: "/services",
});

const serviceIcons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  "web-design-houston": GlobeAltIcon,
  "nextjs-development-houston": CodeBracketIcon,
  "bilingual-websites-houston": ChatBubbleLeftRightIcon,
  "ecommerce-houston": ShoppingCartIcon,
  "seo-local-houston": MagnifyingGlassIcon,
};

export default function ServicesPage() {
  return (
    <>
      <JsonLdForBreadcrumb
        itemList={[
          { name: "Home", item: siteConfig.baseUrl },
          { name: "Services", item: `${siteConfig.baseUrl}/services` },
        ]}
      />

      <main className="bg-gray-950">
        <BackLink href="/#services" label="Back to Home" />
        <section className="relative pt-8 pb-20 sm:pt-12 sm:pb-28">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-iceland">
                Web Development Services in{" "}
                <span className="text-gold">Houston, TX</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300 font-inter">
                Custom websites and web applications for Houston businesses.
                From landing pages to full-stack platforms — built with modern
                technology, optimized for Google, and available in English and
                Spanish.
              </p>
            </div>

            <div className="mx-auto mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {servicePages.map((service) => {
                const Icon = serviceIcons[service.slug];
                return (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}` as Route}
                    className="group rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-gold/30 transition-all duration-300"
                  >
                    {Icon && (
                      <Icon className="h-8 w-8 text-gold mb-4" />
                    )}
                    <h2 className="text-2xl font-iceland text-white group-hover:text-gold transition-colors">
                      {service.title}
                    </h2>
                    <p className="mt-3 text-gray-400 font-inter leading-7 line-clamp-3">
                      {service.subheadline}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-inter font-semibold text-gold">
                        From {service.priceFrom}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-inter text-gold group-hover:underline">
                        Learn more
                        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
