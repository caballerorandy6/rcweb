import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { getPostBySlug } from "@/lib/blog";
import type { Locale } from "@/i18n/routing";
import { formatDate } from "@/lib/utils";
import { loadOgFonts } from "@/lib/og/fonts";
import { BlogPostOgImage } from "@/lib/og/BlogPostOgImage";

export const alt = `${siteConfig.siteNameShort} blog`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ locale: string; slug: string }> };

/** One card per post and language: title, description and tag in the page language */
export default async function Image({ params }: Props) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const post = getPostBySlug(slug, locale);

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
        date={formatDate(post.date, { month: "long", timeZone: "UTC", locale })}
      />
    ),
    { ...size, fonts },
  );
}
