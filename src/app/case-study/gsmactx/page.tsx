import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { siteConfig } from "@/config/site";
import CaseStudyContent from "./CaseStudyContent";

export const metadata = genPageMetadata({
  title: "GSM AC Case Study - HVAC Business Automation",
  description:
    "How we helped GSM A/C & General Contractor save 15 hours per week with a custom admin dashboard, automated email campaigns, and modern website. Full case study with results.",
  pageRoute: "/case-study/gsmactx",
});

export default function GsmacCaseStudyPage() {
  return (
    <>
      <JsonLdForBreadcrumb
        itemList={[
          { name: "Home", item: siteConfig.baseUrl },
          { name: "Case Studies", item: `${siteConfig.baseUrl}/case-study` },
          { name: "GSM AC", item: `${siteConfig.baseUrl}/case-study/gsmactx` },
        ]}
      />
      <CaseStudyContent />
    </>
  );
}
