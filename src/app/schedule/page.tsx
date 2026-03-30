import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { siteConfig } from "@/config/site";
import BackLink from "@/components/ui/BackLink";
import ScheduleContent from "@/components/sections/ScheduleContent";

export const metadata = genPageMetadata({
  title: "Schedule Free Consultation",
  description:
    "Book a free 30-minute consultation with RC Web Solutions LLC to discuss your web development project. No obligation, no commitment – just expert advice and project planning.",
  pageRoute: "/schedule",
});

export default function SchedulePage() {
  return (
    <>
      <JsonLdForBreadcrumb
        itemList={[
          { name: "Home", item: siteConfig.baseUrl },
          { name: "Schedule Consultation", item: `${siteConfig.baseUrl}/schedule` },
        ]}
      />
      <div className="bg-gray-950">
        <BackLink href="/#contact" label="Back to Contact" />
      </div>
      <ScheduleContent />
    </>
  );
}
