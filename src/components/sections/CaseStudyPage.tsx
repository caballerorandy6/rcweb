import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { localizedBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { getCaseStudy, type CaseStudyKey } from "@/lib/caseStudies";
import CaseStudyTemplate from "@/components/sections/CaseStudyTemplate";

/** Metadata of a case-study route (title, description, canonical, hreflang) */
export async function caseStudyMetadata(key: CaseStudyKey, locale: Locale): Promise<Metadata> {
  const { meta, pathname } = await getCaseStudy(key, locale);
  return genPageMetadata({ title: meta.title, description: meta.description, locale, pathname });
}

/** Breadcrumb JSON-LD + the template, in the page language */
export default async function CaseStudyPage({ caseKey, locale }: { caseKey: CaseStudyKey; locale: Locale }) {
  const { data, meta, pathname } = await getCaseStudy(caseKey, locale);
  const crumbs = await localizedBreadcrumbs(locale, [
    { key: "home", pathname: "/" },
    { key: "caseStudies", href: "/case-study" },
    { name: meta.crumb, pathname },
  ]);

  return (
    <>
      <JsonLdForBreadcrumb itemList={crumbs} />
      <CaseStudyTemplate data={data} />
    </>
  );
}
