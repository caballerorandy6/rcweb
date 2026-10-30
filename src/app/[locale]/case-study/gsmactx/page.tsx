import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import CaseStudyPage, { caseStudyMetadata } from "@/components/sections/CaseStudyPage";

type Props = PageProps<"/[locale]/case-study/gsmactx">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return caseStudyMetadata("gsmactx", (await params).locale as Locale);
}

export default async function GsmacCaseStudyPage({ params }: Props) {
  return <CaseStudyPage caseKey="gsmactx" locale={(await params).locale as Locale} />;
}
