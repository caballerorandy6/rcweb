import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { siteConfig } from "@/config/site";
import BackLink from "@/components/ui/BackLink";
import ScheduleContent from "@/components/sections/ScheduleContent";
import { serviceOptions } from "@/lib/data";

export const metadata = genPageMetadata({
  title: "Let's Talk About Your Project",
  description:
    "Tell RC Web Solutions what you need and how you'd like to be contacted: form, phone, WhatsApp, email or a free 30-minute call. You get a clear quote within 24 hours.",
  pageRoute: "/schedule",
});


export default function SchedulePage() {
  return (
    <>
      <JsonLdForBreadcrumb
        itemList={[
          { name: "Home", item: siteConfig.baseUrl },
          { name: "Let's Talk", item: `${siteConfig.baseUrl}/schedule` },
        ]}
      />
      <div className="bg-gray-950">
        <BackLink href="/#contact" label="Back to Contact" />
      </div>
      <ScheduleContent serviceOptions={serviceOptions} />
    </>
  );
}
