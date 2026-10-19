import Link from "next/link";
import type { Route } from "next";
import type { ComponentType, SVGProps } from "react";
import {
  BriefcaseIcon,
  BuildingOffice2Icon,
  CalendarIcon,
  ClockIcon,
  CodeBracketIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import type { BlogPost } from "@/lib/blog";

type Category = {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

// Every post shares the same OG image, so the card header is a typographic
// band whose label and icon come from the post's tags instead of a photo.
const categories = {
  houston: { label: "Houston Business", icon: BuildingOffice2Icon },
  caseStudy: { label: "Case Study", icon: CodeBracketIcon },
  technical: { label: "Performance & Security", icon: ShieldCheckIcon },
  business: { label: "Business", icon: BriefcaseIcon },
} satisfies Record<string, Category>;

const tagToCategory: Record<string, keyof typeof categories> = {
  houston: "houston",
  "small business": "houston",
  "case study": "caseStudy",
  performance: "technical",
  security: "technical",
};

function getCategory(tags: string[] = []): Category {
  for (const tag of tags) {
    const key = tagToCategory[tag.toLowerCase()];
    if (key) return categories[key];
  }
  return categories.business;
}

// Rough estimate: 200 words per minute
function getReadTime(content: string): number {
  return Math.ceil(content.trim().split(/\s+/).length / 200);
}

// Frontmatter dates are plain YYYY-MM-DD; format in UTC so the day never
// shifts with the server's timezone
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

type BlogCardProps = {
  post: BlogPost;
  /** Heading level: `h2` on /blog (where the page owns the h1), `h3` on the home preview */
  as?: "h2" | "h3";
};

export default function BlogCard({ post, as: Heading = "h2" }: BlogCardProps) {
  const { label, icon: Icon } = getCategory(post.tags);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-linear-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-gold/30 transition-all duration-300">
      {/* Category band */}
      <div className="relative flex items-center gap-3 px-6 py-5 bg-linear-to-r from-gold/15 via-gold/5 to-transparent border-b border-gray-700/50">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10 border border-gold/20 text-gold group-hover:bg-gold/20 transition-colors">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-widest text-gold/80 font-inter">
          {label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {post.tags && post.tags.length > 0 ? (
          <ul className="flex flex-wrap gap-2 mb-4" aria-label="Topics">
            {post.tags.slice(0, 3).map((tag) => (
              <li
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gold/10 text-gold border border-gold/20 font-inter"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        {/* Stretched link: the whole card is clickable */}
        <Link
          href={`/blog/${post.slug}` as Route}
          className="absolute inset-0 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <span className="sr-only">Read: {post.title}</span>
        </Link>

        <Heading className="text-2xl text-gold font-iceland mb-3 group-hover:text-gold/90 transition-colors">
          {post.title}
        </Heading>

        <p className="text-white/70 font-inter text-sm leading-relaxed mb-4 grow line-clamp-3">
          {post.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-white/50 font-inter border-t border-gray-700/50 pt-4">
          <span className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" aria-hidden="true" />
            <time dateTime={post.date}>
              {dateFormatter.format(new Date(post.date))}
            </time>
          </span>
          <span className="flex items-center gap-1">
            <ClockIcon className="w-4 h-4" aria-hidden="true" />
            {getReadTime(post.content)} min read
          </span>
          <span className="ml-auto font-semibold text-gold/80 group-hover:text-gold transition-colors">
            Read more &rarr;
          </span>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </article>
  );
}
