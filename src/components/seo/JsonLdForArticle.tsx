/**
 * Generate JSON-LD structured data for an article page in Next.js
 *
 * Requirements:
 * - Next.js 13.0.0 or higher
 * - Next.js App Router
 *
 * Usage:
 * import { JsonLdForArticle } from "@/components/seo/JsonLdForArticle";
 *
 * <JsonLdForArticle
 *   url="https://example.com/article"
 *   headline="Article Title"
 *   description="Article description"
 *   image="https://example.com/image.jpg"
 *   datePublished="2024-01-01"
 *   dateModified="2025-01-01"
 *   author={{ name: "Author Name", url: "https://example.com" }}
 * />
 */

type JsonLdForArticleProps = {
  url: string;
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: {
    name: string;
    url: string;
  };
};

export function JsonLdForArticle({
  url,
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author,
}: JsonLdForArticleProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image,
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name: author.name,
      url: author.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
