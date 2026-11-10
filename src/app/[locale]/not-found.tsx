import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import NotFoundContent from "@/components/layout/NotFoundContent";

/**
 * `<title>` of the 404 in the page language; the locale segment is still resolved here.
 * `robots` replaces the layout's "index, follow", which otherwise sat next to the
 * "noindex" Next adds to every 404 (two contradicting tags in Search Console).
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NotFound");
  return { title: t("title"), robots: { index: false, follow: true } };
}

export default function NotFound() {
  return <NotFoundContent />;
}
