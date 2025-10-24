/**
 * Generate JSON-LD structured data for a breadcrumb page in Next.js
 *
 * Requirements:
 * - Next.js 13.0.0 or higher
 * - Next.js App Router
 *
 * Usage:
 * import { JsonLdForBreadcrumb } from "@/app/components/seo/JsonLdForBreadcrumb";
 *
 * <JsonLdForBreadcrumb
 *   itemList={[
 *     { name: "Home", item: "https://example.com" },
 *     { name: "Page", item: "https://example.com/page" },
 *   ]}
 * />
 */

type BreadcrumbItem = {
  name: string;
  item: string;
};

type JsonLdForBreadcrumbProps = {
  itemList: BreadcrumbItem[];
};

export function JsonLdForBreadcrumb({ itemList }: JsonLdForBreadcrumbProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: itemList.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
