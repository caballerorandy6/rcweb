/**
 * Generate JSON-LD structured data for a FAQ page in Next.js
 *
 * Requirements:
 * - Next.js 13.0.0 or higher
 * - Next.js App Router
 *
 * Usage:
 * import { JsonLdForFaq } from "@/components/seo/JsonLdForFaq";
 *
 * <JsonLdForFaq
 *   faqs={[
 *     { question: "What is this?", answer: "This is an answer." },
 *     { question: "How does it work?", answer: "It works like this." },
 *   ]}
 * />
 */

type FaqItem = {
  question: string;
  answer: string;
};

type JsonLdForFaqProps = {
  faqs: FaqItem[];
};

export function JsonLdForFaq({ faqs }: JsonLdForFaqProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
