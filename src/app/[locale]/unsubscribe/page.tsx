import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Unsubscribe from "@/components/forms/Unsubscribe";
import UnsubscribeSkeleton from "@/components/skeletons/UnsubscribeSkeleton";
import PageMessages from "@/components/layout/PageMessages";
import type { Locale } from "@/i18n/routing";
import { genPageMetadata } from "@/utils/genPageMetadata";

type Props = PageProps<"/[locale]/unsubscribe">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "Unsubscribe" });
  return genPageMetadata({
    title: t("metadata.title"),
    description: t("metadata.description"),
    locale,
    pathname: "/unsubscribe",
    noIndex: true,
  });
}

export default async function UnsubscribePage({ params }: Props) {
  setRequestLocale((await params).locale as Locale);
  return (
    <section id="unsubscribe-page">
      <PageMessages namespaces={["Unsubscribe"]}>
        <Suspense fallback={<UnsubscribeSkeleton />}>
          <Unsubscribe />
        </Suspense>
      </PageMessages>
    </section>
  );
}
