import { notFound } from "next/navigation";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/app/components/seo/JsonLdForBreadcrumb";
import { JsonLdForArticle } from "@/app/components/seo/JsonLdForArticle";
import { siteConfig } from "@/config/site";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import BlogPost from "@/app/components/blog/BlogPost";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

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
    pageRoute: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <JsonLdForBreadcrumb
        itemList={[
          { name: "Home", item: siteConfig.baseUrl },
          { name: "Blog", item: `${siteConfig.baseUrl}/blog` },
          { name: post.title, item: `${siteConfig.baseUrl}/blog/${slug}` },
        ]}
      />
      <JsonLdForArticle
        url={`${siteConfig.baseUrl}/blog/${slug}`}
        headline={post.title}
        description={post.description}
        image={post.image ? `${siteConfig.baseUrl}${post.image}` : `${siteConfig.baseUrl}${siteConfig.defaultOgImg}`}
        datePublished={post.date}
        dateModified={post.date}
        author={{
          name: siteConfig.author.name,
          url: siteConfig.baseUrl,
        }}
      />
      <BlogPost post={post} />
    </>
  );
}
