import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { localizedBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { getLocalizedCatalog } from "@/lib/catalog";
import BackLink from "@/components/ui/BackLink";
import ProjectsList from "@/components/sections/ProjectsList";

export async function generateMetadata({ params }: PageProps<"/[locale]/projects-portfolio">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "Portfolio.metadata" });
  return genPageMetadata({ title: t("title"), description: t("description"), locale, pathname: "/projects-portfolio" });
}

export default async function ProjectsPortfolioPage({ params }: PageProps<"/[locale]/projects-portfolio">) {
  const locale = (await params).locale as Locale;
  const [t, common, crumbs, { projects }] = await Promise.all([
    getTranslations("Portfolio"),
    getTranslations("Common"),
    localizedBreadcrumbs(locale, [
      { key: "home", pathname: "/" },
      { key: "projects", pathname: "/projects-portfolio" },
    ]),
    getLocalizedCatalog(locale),
  ]);

  return (
    <>
      <JsonLdForBreadcrumb itemList={crumbs} />
      <div className="bg-gray-950 min-h-screen">
        <BackLink href={{ pathname: "/", hash: "projects" }} label={common("backToHome")} />
        <section className="pt-8 pb-20 sm:pt-12 sm:pb-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h1 className="text-4xl tracking-tight text-white sm:text-6xl font-iceland">
                {t("title")} <span className="text-gold">{t("titleHighlight")}</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300 font-inter">{t("intro")}</p>
            </div>

            <ProjectsList projects={projects} priorityCount={3} />
          </div>
        </section>
      </div>
    </>
  );
}
