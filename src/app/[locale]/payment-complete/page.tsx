import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import PaymentComplete from "@/components/payment/PaymentComplete";
import PaymentCompleteSkeleton from "@/components/skeletons/PaymentCompleteSkeleton";
import PageMessages from "@/components/layout/PageMessages";
import type { Locale } from "@/i18n/routing";
import { genPageMetadata } from "@/utils/genPageMetadata";

type Props = PageProps<"/[locale]/payment-complete">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "PaymentComplete" });
  return genPageMetadata({
    title: t("metadata.title"),
    description: t("metadata.description"),
    locale,
    pathname: "/payment-complete",
    noIndex: true,
  });
}

export default function PaymentCompletePage() {
  return (
    <PageMessages namespaces={["PaymentComplete"]}>
      <Suspense fallback={<PaymentCompleteSkeleton />}>
        <PaymentComplete />
      </Suspense>
    </PageMessages>
  );
}
