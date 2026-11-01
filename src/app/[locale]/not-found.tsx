import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import NotFoundContent from "@/components/layout/NotFoundContent";

/** `<title>` of the 404 in the page language; the locale segment is still resolved here */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NotFound");
  return { title: t("title") };
}

export default function NotFound() {
  return <NotFoundContent />;
}
