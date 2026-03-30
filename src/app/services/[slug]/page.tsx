import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";

import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { siteConfig } from "@/config/site";
import { servicePages, projects } from "@/lib/data";
import {
  CalendarDaysIcon,
  PhoneIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export function generateStaticParams() {
  return servicePages.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = servicePages.find((s) => s.slug === slug);

  if (!service) return {};

  const url = `${siteConfig.baseUrl}/services/${slug}`;

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: `${service.metaTitle} | ${siteConfig.siteName}`,
      description: service.metaDescription,
      url,
      siteName: siteConfig.siteName,
      images: [{ url: siteConfig.defaultOgImg, width: 1200, height: 630, alt: service.metaTitle }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.metaTitle} | ${siteConfig.siteName}`,
      description: service.metaDescription,
      images: [siteConfig.defaultOgImg],
      creator: siteConfig.social.twitter,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = servicePages.find((s) => s.slug === slug);

  if (!service) notFound();

  const relatedProjects = projects.filter((p) =>
    service.relatedProjects.includes(p.name)
  );

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.subheadline,
    provider: {
      "@type": "ProfessionalService",
      name: siteConfig.siteName,
      url: siteConfig.baseUrl,
      telephone: "+1-346-375-7534",
      areaServed: {
        "@type": "City",
        name: "Houston",
        "@id": "https://www.wikidata.org/wiki/Q16555",
      },
    },
    areaServed: {
      "@type": "City",
      name: "Houston",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${siteConfig.baseUrl}/schedule`,
      servicePhone: "+1-346-375-7534",
    },
  };

  return (
    <>
      <JsonLdForBreadcrumb
        itemList={[
          { name: "Home", item: siteConfig.baseUrl },
          { name: "Services", item: `${siteConfig.baseUrl}/services` },
          {
            name: service.title,
            item: `${siteConfig.baseUrl}/services/${slug}`,
          },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      <main className="bg-gray-950">
        {/* Hero */}
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <Link
                href={"/services" as Route}
                className="inline-flex items-center gap-2 text-sm font-inter text-gold/70 hover:text-gold transition-colors mb-8"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                All Services
              </Link>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-iceland">
                {service.headline}
              </h1>

              <p className="mt-6 text-lg leading-8 text-gray-300 font-inter">
                {service.subheadline}
              </p>

              <div className="mt-8 flex items-center gap-4">
                <span className="text-sm font-inter text-gold/70">
                  Starting at
                </span>
                <span className="text-2xl font-bold font-iceland text-gold">
                  {service.priceFrom}
                </span>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/schedule"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold via-yellow-200 to-gold px-6 py-4 text-base font-semibold text-black hover:from-yellow-200 hover:via-gold hover:to-yellow-200 transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter"
                >
                  <CalendarDaysIcon className="h-5 w-5" />
                  {service.cta}
                </Link>
                <a
                  href="tel:+13463757534"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-gold/50 px-6 py-3 text-base font-semibold text-gold hover:bg-gold/10 hover:border-gold/60 transition-all duration-200 font-inter"
                >
                  <PhoneIcon className="h-5 w-5" />
                  (346) 375-7534
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <p className="text-gray-300 font-inter leading-8 text-lg">
                {service.content}
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 sm:py-28 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-iceland">
                What&apos;s Included
              </h2>
            </div>

            <div className="mx-auto max-w-4xl grid grid-cols-1 gap-8 sm:grid-cols-2">
              {service.features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-8"
                >
                  <h3 className="text-xl font-semibold text-white font-iceland">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-gray-400 font-inter leading-7">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center mb-16">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-iceland">
                  Related Projects
                </h2>
                <p className="mt-4 text-lg text-gray-400 font-inter">
                  Houston businesses I&apos;ve built this type of solution for.
                </p>
              </div>

              <div className="mx-auto max-w-4xl grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProjects.map((project) => (
                  <a
                    key={project.name}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-gold/30 transition-all duration-300"
                  >
                    <h3 className="text-xl font-semibold text-white font-iceland group-hover:text-gold transition-colors">
                      {project.name}
                    </h3>
                    <p className="mt-3 text-gray-400 font-inter leading-7 line-clamp-3">
                      {project.description}
                    </p>
                    <span className="mt-4 inline-flex text-sm font-medium text-gold group-hover:underline font-inter">
                      Visit site &rarr;
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-20 sm:py-28 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-iceland">
                Ready to Get Started?
              </h2>
              <p className="mt-6 text-lg text-gray-400 font-inter">
                Book a free 30-minute consultation. I&apos;ll review your
                current situation and show you exactly what I can build for your
                business.
              </p>
              <div className="mt-10">
                <Link
                  href="/schedule"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold via-yellow-200 to-gold px-8 py-4 text-lg font-semibold text-black hover:from-yellow-200 hover:via-gold hover:to-yellow-200 transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter"
                >
                  <CalendarDaysIcon className="h-5 w-5" />
                  Schedule Free Consultation
                </Link>
              </div>
              <p className="mt-6 text-sm text-gray-500 font-inter">
                Or call directly:{" "}
                <a
                  href="tel:+13463757534"
                  className="text-gold hover:underline"
                >
                  (346) 375-7534
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
