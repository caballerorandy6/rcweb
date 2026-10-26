import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
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
  content: string;
}

/** gray-matter turns unquoted YAML dates into Date objects; keep YYYY-MM-DD strings */
function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return typeof value === 'string' ? value : '';
}

function parsePost(slug: string, fileContents: string): BlogPost {
  const { data, content } = matter(fileContents);
  const updated = toDateString(data.updated);

  return {
    slug,
    title: data.title || '',
    description: data.description || '',
    date: toDateString(data.date),
    ...(updated && { updated }),
    author: data.author || 'RC Web Solutions',
    image: data.image || '',
    tags: data.tags || [],
    content,
  };
}

export const getAllPosts = cache((): BlogPost[] => {
  // Check if directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      return parsePost(slug, fs.readFileSync(fullPath, 'utf8'));
    });

  // Sort posts by date (newest first)
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
});

export const getPostBySlug = cache((slug: string): BlogPost | null => {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    return parsePost(slug, fs.readFileSync(fullPath, 'utf8'));
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
});

export const getAllSlugs = cache((): string[] => {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
});
