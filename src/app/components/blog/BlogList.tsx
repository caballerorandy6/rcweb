"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { BookOpenIcon, CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import Heading from "@/app/components/ui/Heading";
import BlogSubscriptionForm from "@/app/components/blog/BlogSubscriptionForm";
import type { BlogPost } from "@/lib/blog";

interface BlogListProps {
  posts: BlogPost[];
}

export default function BlogList({ posts }: BlogListProps) {
  // Calculate read time (rough estimate: 200 words per minute)
  const calculateReadTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes;
  };

  return (
    <section className="relative isolate overflow-hidden py-24 sm:py-32 bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="absolute top-0 -left-4 w-96 h-96 bg-gold/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-gold/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<BookOpenIcon className="w-8 text-gold" />}
          text="Learn, Grow, Succeed"
        >
          Web Development Blog
        </Heading>

        {/* Newsletter Subscription */}
        <div className="mt-12 mb-8">
          <BlogSubscriptionForm />
        </div>

        {/* Blog Posts Grid */}
        {posts.length > 0 ? (
          <motion.div
            className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {posts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-gray-700/50 hover:border-gold/30 transition-all duration-300"
              >
                {/* Featured Image */}
                {post.image && (
                  <div className="relative h-48 overflow-hidden bg-gray-800">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6">
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gold/10 text-gold border border-gold/20 font-inter"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <Link href={`/blog/${post.slug}` as Route} className="absolute inset-0" aria-hidden="true">
                    <span className="sr-only">{post.title}</span>
                  </Link>
                  <h3 className="text-2xl font-bold text-gold font-iceland mb-3 group-hover:text-gold/90 transition-colors relative">
                    {post.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/70 font-inter text-sm leading-relaxed mb-4 flex-grow">
                    {post.description}
                  </p>

                  {/* Meta information */}
                  <div className="flex items-center gap-4 text-xs text-white/50 font-inter border-t border-gray-700/50 pt-4">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{calculateReadTime(post.content)} min read</span>
                    </div>
                  </div>
                </div>

                {/* Hover effect border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            className="mt-16 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-gray-800/30 backdrop-blur-md rounded-2xl border border-gold/20 p-12">
              <BookOpenIcon className="w-16 h-16 text-gold/40 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gold font-iceland mb-3">
                Coming Soon
              </h3>
              <p className="text-white/60 font-inter leading-relaxed mb-6">
                We&apos;re working on amazing content about web development, SEO, and
                digital marketing. Check back soon!
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-gray-900 font-semibold rounded-lg hover:bg-gold/90 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
