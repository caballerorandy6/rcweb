import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import CaseStudyPage, { caseStudyMetadata } from "@/components/sections/CaseStudyPage";

type Props = PageProps<"/[locale]/case-study/clinica-gessner">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return caseStudyMetadata("clinicaGessner", (await params).locale as Locale);
}

export default async function ClinicaGessnerCaseStudyPage({ params }: Props) {
  return <CaseStudyPage caseKey="clinicaGessner" locale={(await params).locale as Locale} />;
}
