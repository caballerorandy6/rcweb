import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { localizedBreadcrumbs } from "@/lib/seo/breadcrumbs";
import type { Locale } from "@/i18n/routing";
import BackLink from "@/components/ui/BackLink";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Certifications from "@/components/sections/Certifications";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "About.metadata" });
  return genPageMetadata({ title: t("title"), description: t("description"), locale, pathname: "/about" });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [crumbs, t] = await Promise.all([
    localizedBreadcrumbs(locale, [
      { key: "home", pathname: "/" },
      { key: "about", pathname: "/about" },
    ]),
    getTranslations("Common"),
  ]);

  return (
    <>
      <JsonLdForBreadcrumb itemList={crumbs} />
      <div className="bg-gray-900 min-h-screen">
        <BackLink href="/" label={t("backToHome")} />
        <About />
        <Experience />
        <Certifications />
      </div>
    </>
  );
}
