import PrivacyPolicy from "@/components/sections/PrivacyPolicy";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { siteConfig } from "@/config/site";

export const metadata = genPageMetadata({
  title: "Privacy Policy",
  description:
    "Privacy Policy for RC Web Solutions LLC. Learn how we collect, use, and protect your personal data when using our web development services.",
  pageRoute: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <section id="privacy-policy">
      <JsonLdForBreadcrumb
        itemList={[
          { name: "Home", item: siteConfig.baseUrl },
          { name: "Privacy Policy", item: `${siteConfig.baseUrl}/privacy-policy` },
        ]}
      />
      <PrivacyPolicy />
    </section>
  );
}
