import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import CaseStudyPage, { caseStudyMetadata } from "@/components/sections/CaseStudyPage";

type Props = PageProps<"/[locale]/case-study/leos-home-experts">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return caseStudyMetadata("leosHomeExperts", (await params).locale as Locale);
}

export default async function LeosHomeExpertsCaseStudyPage({ params }: Props) {
  return <CaseStudyPage caseKey="leosHomeExperts" locale={(await params).locale as Locale} />;
}
