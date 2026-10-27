import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import { formatDate } from "@/lib/utils";
import { loadOgFonts } from "@/lib/og/fonts";
import { BlogPostOgImage } from "@/lib/og/BlogPostOgImage";

export const alt = `Article on the ${siteConfig.siteNameShort} blog`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Prerender one card per post at build time, like the pages themselves
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  const fonts = await loadOgFonts();

  return new ImageResponse(
    (
      <BlogPostOgImage
        title={post.title}
        description={post.description}
        tag={post.tags?.[0]}
        author={post.author}
        date={formatDate(post.date, { month: "long", timeZone: "UTC" })}
      />
    ),
    { ...size, fonts },
  );
}
