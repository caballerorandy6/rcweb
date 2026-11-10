import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { getLocalizedCatalog } from "@/lib/catalog";

// Sections are Server Components: they ship HTML, not JS, so there is
// nothing to lazy-load. Only the floating CTA (client) is split off.
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Process from "@/components/sections/Process";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import BlogPreview from "@/components/sections/BlogPreview";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

const CTA = dynamic(() => import("@/components/sections/FloatingCTA"));

import ScrollSpy from "@/components/ui/ScrollSpy";
import { JsonLdForFaq } from "@/components/seo/JsonLdForFaq";
import { JsonLdForService } from "@/components/seo/JsonLdForService";
import { JsonLdForLocalBusiness } from "@/components/seo/JsonLdForLocalBusiness";
import { JsonLdForWebSite } from "@/components/seo/JsonLdForWebSite";
import type { Locale } from "@/i18n/routing";

// Shows the Google reviews from the database: regenerated after each sync
// (revalidatePagesWithReviews) and, as a safety net, every 7 days
// (GOOGLE_REVIEWS_REFRESH_DAYS; it must be a literal here).
export const revalidate = 604800;

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "Metadata.home" });
  return genPageMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    pathname: "/",
  });
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const { faqs, offers } = await getLocalizedCatalog(locale);

  return (
    <div>
      <JsonLdForLocalBusiness />
      <JsonLdForWebSite />
      <JsonLdForFaq faqs={faqs} />
      {offers.map((offer) => (
        <JsonLdForService key={offer.id} offer={offer} />
      ))}
      <ScrollSpy />
      <Hero />
      <Services />
      <Projects />
      <Process />
      <Testimonials />
      <Pricing />
      <BlogPreview />
      <FAQ />
      <Contact />
      <CTA />
    </div>
  );
}
