import RefundPolicy from "@/app/components/Sections/RefundPolicy";
import { JsonLdForBreadcrumb } from "@/app/components/seo/JsonLdForBreadcrumb";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { siteConfig } from "@/config/site";

export const metadata = genPageMetadata({
  title: "Refund Policy",
  description:
    "Refund Policy for RC Web Solutions LLC. Understand our two-payment structure, no-refund policy after first payment, and cancellation terms for web development projects.",
  pageRoute: "/refund-policy",
});

export default function RefundPolicyPage() {
  return (
    <section id="refund-policy">
      <JsonLdForBreadcrumb
        itemList={[
          { name: "Home", item: siteConfig.baseUrl },
          { name: "Refund Policy", item: `${siteConfig.baseUrl}/refund-policy` },
        ]}
      />
      <RefundPolicy />
    </section>
  );
}