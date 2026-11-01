import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import CaseStudyPage, { caseStudyMetadata } from "@/components/sections/CaseStudyPage";

type Props = PageProps<"/[locale]/case-study/clinica-airline">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return caseStudyMetadata("clinicaAirline", (await params).locale as Locale);
}

export default async function ClinicaAirlineCaseStudyPage({ params }: Props) {
  return <CaseStudyPage caseKey="clinicaAirline" locale={(await params).locale as Locale} />;
}
