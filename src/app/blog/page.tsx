import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/app/components/seo/JsonLdForBreadcrumb";
import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/blog";
import BlogList from "@/app/components/blog/BlogList";

export const metadata = genPageMetadata({
  title: "Blog - Web Development Insights & Tips",
  description:
    "Read expert articles about web development, SEO, e-commerce, and digital marketing. Learn how to grow your business online with RC Web Solutions.",
  pageRoute: "/blog",
});

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <JsonLdForBreadcrumb
        itemList={[
          { name: "Home", item: siteConfig.baseUrl },
          { name: "Blog", item: `${siteConfig.baseUrl}/blog` },
        ]}
      />
      <BlogList posts={posts} />
    </>
  );
}
