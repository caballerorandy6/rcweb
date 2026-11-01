import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import CaseStudyPage, { caseStudyMetadata } from "@/components/sections/CaseStudyPage";

type Props = PageProps<"/[locale]/case-study/dulce-antojo">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return caseStudyMetadata("dulceAntojo", (await params).locale as Locale);
}

export default async function DulceAntojoCaseStudyPage({ params }: Props) {
  return <CaseStudyPage caseKey="dulceAntojo" locale={(await params).locale as Locale} />;
}
