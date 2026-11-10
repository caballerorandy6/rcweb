import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { localizedBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { getAllPosts } from "@/lib/blog";
import type { Locale } from "@/i18n/routing";
import BackLink from "@/components/ui/BackLink";
import BlogList from "@/components/blog/BlogList";

type Props = PageProps<"/[locale]/blog">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "Blog.metadata" });
  return genPageMetadata({ title: t("title"), description: t("description"), locale, pathname: "/blog" });
}

export default async function BlogPage({ params }: Props) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [crumbs, t] = await Promise.all([
    localizedBreadcrumbs(locale, [
      { key: "home", pathname: "/" },
      { key: "blog", pathname: "/blog" },
    ]),
    getTranslations("Common"),
  ]);
  const posts = getAllPosts(locale);

  return (
    <>
      <JsonLdForBreadcrumb itemList={crumbs} />
      <div className="bg-gray-900">
        <BackLink href={{ pathname: "/", hash: "blog" }} label={t("backToHome")} />
      </div>
      <BlogList posts={posts} />
    </>
  );
}
