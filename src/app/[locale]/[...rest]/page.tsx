import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

/**
 * Any path with no page under the locale segment. Without this catch-all,
 * Next would answer with its bare default 404; with it, the request reaches
 * app/[locale]/not-found.tsx: the designed page, header and footer, in the
 * language of the URL.
 *
 * The <title> is declared here and not only in not-found.tsx: a nested
 * not-found's metadata is applied to the server HTML but the client router
 * keeps the metadata of the page segment, which is this one.
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NotFound");
  return { title: t("title") };
}

export default function CatchAllPage() {
  notFound();
}
