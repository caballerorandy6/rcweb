import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/app/components/seo/JsonLdForBreadcrumb";
import { siteConfig } from "@/config/site";
import GuideContent from "@/app/components/sections/GuideContent";

export const metadata = genPageMetadata({
  title: "Free Web Development Guide for Small Businesses",
  description:
    "Download our free comprehensive web development guide. Learn best practices, SEO fundamentals, security tips, and cost-effective strategies to grow your online presence.",
  pageRoute: "/guide",
});

export default function GuidePage() {
  return (
    <>
      <JsonLdForBreadcrumb
        itemList={[
          { name: "Home", item: siteConfig.baseUrl },
          { name: "Free Web Development Guide", item: `${siteConfig.baseUrl}/guide` },
        ]}
      />
      <GuideContent />
    </>
  );
}
