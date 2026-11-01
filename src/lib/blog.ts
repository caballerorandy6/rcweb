import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Posts are Markdown files in `content/blog/<slug>.md` (English, the
 * canonical version: it owns the slug, dates, author and image). A Spanish
 * translation is `content/blog/es/<slug>.md` with the same slug and a front
 * matter of only `title`, `description` and `tags`; everything else is
 * inherited from the English file. A post without translation is simply
 * absent from `/es/blog`, and its English page carries no hreflang.
 */

const postsDirectory = path.join(process.cwd(), "content/blog");

/** Card category, decided by the English tags so both languages agree */
export type BlogCategory = "houston" | "caseStudy" | "technical" | "business";

export interface BlogPost {
  slug: string;
  /** Language of `title`, `description`, `tags` and `content` */
  locale: Locale;
  /** Languages this post exists in; always includes English */
  translations: Locale[];
  title: string;
  description: string;
  /** Publication date, YYYY-MM-DD */
  date: string;
  /**
   * Date of the last material revision, YYYY-MM-DD. Drives `dateModified`,
   * `og:modified_time` and the sitemap; leave it out when the post was never revised.
   */
  updated?: string;
  author: string;
  /** Optional hero image path; the social card is generated per post regardless */
  image?: string;
  tags?: string[];
  category: BlogCategory;
  content: string;
}

const tagToCategory: Record<string, BlogCategory> = {
  houston: "houston",
  "small business": "houston",
  "case study": "caseStudy",
  performance: "technical",
  security: "technical",
};

function getCategory(tags: string[]): BlogCategory {
  for (const tag of tags) {
    const key = tagToCategory[tag.toLowerCase()];
    if (key) return key;
  }
  return "business";
}

/** gray-matter turns unquoted YAML dates into Date objects; keep YYYY-MM-DD strings */
function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return typeof value === "string" ? value : "";
}

function postFile(slug: string, locale: Locale): string {
  const dir = locale === routing.defaultLocale ? postsDirectory : path.join(postsDirectory, locale);
  return path.join(dir, `${slug}.md`);
}

function slugsIn(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}

function translationsOf(slug: string): Locale[] {
  return routing.locales.filter((locale) => fs.existsSync(postFile(slug, locale)));
}

function readPost(slug: string, locale: Locale): BlogPost | null {
  const englishFile = postFile(slug, routing.defaultLocale);
  if (!fs.existsSync(englishFile)) return null;

  const english = matter(fs.readFileSync(englishFile, "utf8"));
  const tags: string[] = english.data.tags || [];
  const updated = toDateString(english.data.updated);

  const base: BlogPost = {
    slug,
    locale: routing.defaultLocale,
    translations: translationsOf(slug),
    title: english.data.title || "",
    description: english.data.description || "",
    date: toDateString(english.data.date),
    ...(updated && { updated }),
    author: english.data.author || "RC Web Solutions",
    image: english.data.image || "",
    tags,
    category: getCategory(tags),
    content: english.content,
  };
  if (locale === routing.defaultLocale) return base;

  const file = postFile(slug, locale);
  if (!fs.existsSync(file)) return null;
  const translated = matter(fs.readFileSync(file, "utf8"));
  return {
    ...base,
    locale,
    title: translated.data.title || base.title,
    description: translated.data.description || base.description,
    tags: translated.data.tags || base.tags,
    content: translated.content,
  };
}

/** Every post available in `locale`, newest first */
export const getAllPosts = cache((locale: Locale = routing.defaultLocale): BlogPost[] => {
  const posts = slugsIn(postsDirectory)
    .map((slug) => readPost(slug, locale))
    .filter((post): post is BlogPost => post !== null);

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
});

/** One post in `locale`, or null when it does not exist in that language */
export const getPostBySlug = cache(
  (slug: string, locale: Locale = routing.defaultLocale): BlogPost | null => {
    // A slug is a file name: refuse anything that could leave the posts directory
    if (!/^[a-z0-9-]+$/.test(slug)) return null;
    return readPost(slug, locale);
  }
);

/** Slugs of the posts available in `locale` (English defines the canon) */
export const getAllSlugs = cache((locale: Locale = routing.defaultLocale): string[] => {
  const english = slugsIn(postsDirectory);
  if (locale === routing.defaultLocale) return english;
  const translated = new Set(slugsIn(path.join(postsDirectory, locale)));
  return english.filter((slug) => translated.has(slug));
});
