import type { Metadata } from "next";
import { Suspense } from "react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { localizedBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { getLegalDocument } from "@/lib/legal";
import type { Locale } from "@/i18n/routing";
import LegalDocument from "@/components/legal/LegalDocument";
import { TermsAcceptActions, TermsReviewNotice } from "@/components/sections/TermsAcceptance";

type Props = PageProps<"/[locale]/terms-of-service">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const doc = getLegalDocument("terms-of-service", locale);
  return genPageMetadata({
    title: doc.title,
    description: doc.description,
    locale,
    pathname: "/terms-of-service",
  });
}

/** The checkout flow lands here with `?plan=`; the notice and the accept actions only show then. */
export default async function TermsOfServicePage({ params }: Props) {
  const locale = (await params).locale as Locale;
  const doc = getLegalDocument("terms-of-service", locale);
  const crumbs = await localizedBreadcrumbs(locale, [
    { key: "home", pathname: "/" },
    { name: doc.title, pathname: "/terms-of-service" },
  ]);

  return (
    <>
      <JsonLdForBreadcrumb itemList={crumbs} />
      <LegalDocument
        doc={doc}
        icon={<DocumentTextIcon className="w-8 text-gold" />}
        top={
          <Suspense fallback={null}>
            <TermsReviewNotice />
          </Suspense>
        }
        bottom={
          <Suspense fallback={null}>
            <TermsAcceptActions />
          </Suspense>
        }
      />
    </>
  );
}
