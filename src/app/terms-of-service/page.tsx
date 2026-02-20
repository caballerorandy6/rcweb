import TermsOfService from "@/components/sections/TermsOfService";
import TermsOfServiceSkeleton from "@/components/skeletons/TermsOfServiceSkeleton";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { siteConfig } from "@/config/site";
import { Suspense } from "react";

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
      <Suspense fallback={<TermsOfServiceSkeleton />}>
        <TermsOfService />
      </Suspense>
    </section>
  );
}
