import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ManageSubscription from "@/components/sections/ManageSubscription";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import PageMessages from "@/components/layout/PageMessages";
import type { Locale } from "@/i18n/routing";
import { localizedBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { genPageMetadata } from "@/utils/genPageMetadata";

type Props = PageProps<"/[locale]/manage-subscription">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "ManageSubscription" });
  return genPageMetadata({
    title: t("metadata.title"),
    description: t("metadata.description"),
    locale,
    pathname: "/manage-subscription",
    noIndex: true,
  });
}

export default async function ManageSubscriptionPage({ params, searchParams }: Props) {
  const [{ locale: rawLocale }, { error }, t] = await Promise.all([
    params,
    searchParams,
    getTranslations("ManageSubscription"),
  ]);
  const locale = rawLocale as Locale;
  const crumbs = await localizedBreadcrumbs(locale, [
    { key: "home", pathname: "/" },
    { name: t("title"), pathname: "/manage-subscription" },
  ]);
  const errorKey = typeof error === "string" ? error : undefined;

  return (
    <section id="manage-subscription">
      <JsonLdForBreadcrumb itemList={crumbs} />
      <PageMessages namespaces={["ManageSubscription"]}>
        <ManageSubscription error={errorKey} />
      </PageMessages>
    </section>
  );
}
