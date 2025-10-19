import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/app/components/JsonLdForBreadcrumb";
import { siteConfig } from "@/config/site";
import OfferContent from "@/app/components/OfferContent";

export const metadata = genPageMetadata({
  title: "20% OFF Web Development Services - Limited Time Offer",
  description:
    "Save 20% on professional web development services! Limited time offer on full-stack applications, e-commerce websites, landing pages, and more. Contact RC Web Solutions LLC today.",
  pageRoute: "/offer",
});

export default function OfferPage() {
  return (
    <>
      <JsonLdForBreadcrumb
        itemList={[
          { name: "Home", item: siteConfig.baseUrl },
          { name: "Special Offer", item: `${siteConfig.baseUrl}/offer` },
        ]}
      />
      <OfferContent />
    </>
  );
}
