import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { localizedBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { getLocalizedCatalog } from "@/lib/catalog";
import BackLink from "@/components/ui/BackLink";
import ScheduleContent from "@/components/sections/ScheduleContent";

export async function generateMetadata({ params }: PageProps<"/[locale]/schedule">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "Schedule" });
  return genPageMetadata({ title: t("metadata.title"), description: t("metadata.description"), locale, pathname: "/schedule" });
}

export default async function SchedulePage({ params }: PageProps<"/[locale]/schedule">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [t, crumbs, { offers }] = await Promise.all([
    getTranslations("Schedule"),
    localizedBreadcrumbs(locale, [
      { key: "home", pathname: "/" },
      { key: "letsTalk", pathname: "/schedule" },
    ]),
    getLocalizedCatalog(locale),
  ]);
  const serviceOptions = offers.map(({ id, title }) => ({ id, title }));

  return (
    <>
      <JsonLdForBreadcrumb itemList={crumbs} />
      <div className="bg-gray-950">
        <BackLink href={{ pathname: "/", hash: "contact" }} label={t("back")} />
      </div>
      <ScheduleContent serviceOptions={serviceOptions} />
    </>
  );
}
