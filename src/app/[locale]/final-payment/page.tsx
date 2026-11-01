import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import FinalPayment from "@/components/payment/FinalPayment";
import PageMessages from "@/components/layout/PageMessages";
import type { Locale } from "@/i18n/routing";
import { genPageMetadata } from "@/utils/genPageMetadata";

type Props = PageProps<"/[locale]/final-payment">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "FinalPayment" });
  return genPageMetadata({
    title: t("metadata.title"),
    description: t("metadata.description"),
    locale,
    pathname: "/final-payment",
    noIndex: true,
  });
}

// Reasons /pay/[token] sends the customer here instead of to Stripe
const NOTICE_KEYS = ["invalid-link", "project-not-ready", "payment-failed", "too-many-requests"] as const;
type NoticeKey = (typeof NOTICE_KEYS)[number];

export default async function FinalPaymentPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const t = await getTranslations("FinalPayment");
  const notice =
    typeof error === "string" && (NOTICE_KEYS as readonly string[]).includes(error)
      ? t(`notices.${error as NoticeKey}`)
      : undefined;

  return (
    <section id="final-payment">
      <PageMessages namespaces={["FinalPayment"]}>
        <FinalPayment notice={notice} />
      </PageMessages>
    </section>
  );
}
