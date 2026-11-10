import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { localizedBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { getLegalDocument } from "@/lib/legal";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import LegalDocument from "@/components/legal/LegalDocument";
import BackButton from "@/components/ui/BackButton";

type Props = PageProps<"/[locale]/refund-policy">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const doc = getLegalDocument("refund-policy", locale);
  return genPageMetadata({
    title: doc.title,
    description: doc.description,
    locale,
    pathname: "/refund-policy",
  });
}

export default async function RefundPolicyPage({ params }: Props) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const doc = getLegalDocument("refund-policy", locale);
  const [crumbs, t] = await Promise.all([
    localizedBreadcrumbs(locale, [
      { key: "home", pathname: "/" },
      { name: doc.title, pathname: "/refund-policy" },
    ]),
    getTranslations("Legal"),
  ]);

  return (
    <>
      <JsonLdForBreadcrumb itemList={crumbs} />
      <LegalDocument
        doc={doc}
        icon={<CurrencyDollarIcon className="w-8 text-gold" />}
        top={
          <div className="mb-8 max-w-5xl mx-auto flex justify-end animate-enter">
            <BackButton />
          </div>
        }
        bottom={
          <div className="mt-8 text-center reveal">
            <Link
              href={{ pathname: "/", hash: "pricing" }}
              className="text-white/50 hover:text-gold underline text-sm transition-colors font-inter"
            >
              {t("returnToPricing")}
            </Link>
          </div>
        }
      />
    </>
  );
}
