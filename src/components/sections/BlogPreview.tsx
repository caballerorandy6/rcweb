import Link from "next/link";
import type { Route } from "next";
import Image from "next/image";
import { BookOpenIcon, CalendarIcon } from "@heroicons/react/24/outline";
import Heading from "@/components/ui/Heading";
import { getAllPosts } from "@/lib/blog";

export default function BlogPreview() {
  const posts = getAllPosts().slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section
      id="blog"
      className="relative isolate overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-24 bg-gray-900"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<BookOpenIcon className="w-8 text-gold" />}
          text="Tips and insights for Houston business owners"
        >
          From the Blog
        </Heading>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <article
              key={post.slug}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-700/50 hover:border-gold/30 transition-all duration-300"
            >
              {post.image && (
                <div className="relative h-48 overflow-hidden bg-gray-800">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
                </div>
              )}

              <div className="flex flex-1 flex-col p-6">
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gold/10 text-gold border border-gold/20 font-inter"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <h2 className="text-xl font-iceland text-white group-hover:text-gold transition-colors line-clamp-2">
                  {post.title}
                </h2>

                <p className="mt-3 text-sm text-white/60 font-inter line-clamp-2">
                  {post.description}
                </p>

                <div className="mt-auto pt-4 flex items-center gap-2 text-xs text-white/40 font-inter">
                  <CalendarIcon className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>

                <Link
                  href={`/blog/${post.slug}` as Route}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-inter font-semibold text-gold hover:underline"
                >
                  Read more &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Posts */}
        <div className="mt-12 text-center">
          <Link
            href={"/blog" as Route}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-inter font-semibold text-gold border-2 border-gold/50 hover:bg-gold/10 hover:border-gold/60 rounded-xl transition-all duration-200 hover:scale-105"
          >
            View All Posts
            <span>&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
