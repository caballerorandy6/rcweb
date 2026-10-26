/**
 * JSON-LD for a blog post (`BlogPosting`, the Article subtype Google lists
 * for blogs). The publisher is the site organization by `@id`, declared once
 * in JsonLdForLocalBusiness.
 *
 * Usage:
 * import { JsonLdForArticle } from "@/components/seo/JsonLdForArticle";
 *
 * <JsonLdForArticle
 *   url="https://example.com/blog/post"
 *   headline="Article Title"
 *   description="Article description"
 *   image="https://example.com/blog/post/opengraph-image"
 *   datePublished="2026-01-01"
 *   dateModified="2026-02-01"
 *   keywords={["Next.js", "SEO"]}
 *   author={{ name: "Author Name", url: "https://example.com/about" }}
 * />
 */

import { ORGANIZATION_ID } from "@/components/seo/JsonLdForLocalBusiness";

type JsonLdForArticleProps = {
  url: string;
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  keywords?: string[];
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
  keywords,
  author,
}: JsonLdForArticleProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    image,
    datePublished,
    dateModified,
    inLanguage: "en-US",
    ...(keywords?.length && { keywords }),
    author: {
      "@type": "Person",
      name: author.name,
      url: author.url,
    },
    publisher: { "@id": ORGANIZATION_ID },
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
