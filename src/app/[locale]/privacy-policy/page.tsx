import type { Metadata } from "next";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { localizedBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { getLegalDocument } from "@/lib/legal";
import type { Locale } from "@/i18n/routing";
import LegalDocument from "@/components/legal/LegalDocument";
import BackButton from "@/components/ui/BackButton";

type Props = PageProps<"/[locale]/privacy-policy">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const doc = getLegalDocument("privacy-policy", locale);
  return genPageMetadata({
    title: doc.title,
    description: doc.description,
    locale,
    pathname: "/privacy-policy",
  });
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const locale = (await params).locale as Locale;
  const doc = getLegalDocument("privacy-policy", locale);
  const crumbs = await localizedBreadcrumbs(locale, [
    { key: "home", pathname: "/" },
    { name: doc.title, pathname: "/privacy-policy" },
  ]);

  return (
    <>
      <JsonLdForBreadcrumb itemList={crumbs} />
      <LegalDocument
        doc={doc}
        icon={<ShieldCheckIcon className="w-8 text-gold" />}
        top={
          <div className="mb-8 max-w-5xl mx-auto flex justify-end animate-enter">
            <BackButton />
          </div>
        }
      />
    </>
  );
}
