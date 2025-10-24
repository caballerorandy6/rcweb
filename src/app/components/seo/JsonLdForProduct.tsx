/**
 * Generate JSON-LD structured data for a product page in Next.js
 *
 * Requirements:
 * - Next.js 13.0.0 or higher
 * - Next.js App Router
 *
 * Usage:
 * import { JsonLdForProduct } from "@/app/components/seo/JsonLdForProduct";
 *
 * <JsonLdForProduct
 *   name="Product Name"
 *   description="Product description"
 *   image="https://example.com/product.jpg"
 * />
 */

type JsonLdForProductProps = {
  name: string;
  description: string;
  image: string;
};

export function JsonLdForProduct({
  name,
  description,
  image,
}: JsonLdForProductProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
