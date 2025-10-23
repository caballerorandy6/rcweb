import { notFound } from "next/navigation";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/app/components/JsonLdForBreadcrumb";
import { siteConfig } from "@/config/site";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import BlogPost from "@/app/components/Blog/BlogPost";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return genPageMetadata({
      title: "Post Not Found",
      description: "The blog post you're looking for doesn't exist.",
      pageRoute: "/blog",
    });
  }

  return genPageMetadata({
    title: post.title,
    description: post.description,
    pageRoute: `/blog/${params.slug}`,
  });
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <JsonLdForBreadcrumb
        itemList={[
          { name: "Home", item: siteConfig.baseUrl },
          { name: "Blog", item: `${siteConfig.baseUrl}/blog` },
          { name: post.title, item: `${siteConfig.baseUrl}/blog/${params.slug}` },
        ]}
      />
      <BlogPost post={post} />
    </>
  );
}
