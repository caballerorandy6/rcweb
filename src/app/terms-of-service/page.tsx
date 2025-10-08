import TermsOfService from "@/app/components/Sections/TermsOfService";
import { JsonLdForBreadcrumb } from "@/app/components/JsonLdForBreadcrumb";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { siteConfig } from "@/config/site";

export const metadata = genPageMetadata({
  title: "Terms of Service",
  description:
    "Terms of Service for RC Web Solutions LLC. Review our service terms, payment conditions, intellectual property rights, warranties, liability, and client responsibilities for web development projects.",
  pageRoute: "/terms-of-service",
});

export default function TermsOfServicePage() {
  return (
    <section id="terms-of-service">
      <JsonLdForBreadcrumb
        itemList={[
          { name: "Home", item: siteConfig.baseUrl },
          { name: "Terms of Service", item: `${siteConfig.baseUrl}/terms-of-service` },
        ]}
      />
      <TermsOfService />
    </section>
  );
}
