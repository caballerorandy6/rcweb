import Link from "next/link";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import Heading from "@/components/ui/Heading";
import BlogCard from "@/components/blog/BlogCard";
import BlogSubscriptionForm from "@/components/blog/BlogSubscriptionForm";
import type { BlogPost } from "@/lib/blog";

interface BlogListProps {
  posts: BlogPost[];
}

export default function BlogList({ posts }: BlogListProps) {
  return (
    <section className="relative isolate overflow-hidden py-24 sm:py-32 bg-linear-to-b from-gray-900 via-gray-900/95 to-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="absolute top-0 -left-4 w-96 h-96 rounded-full bg-radial from-gold/20 to-transparent to-70%"></div>
        <div className="absolute bottom-0 -right-4 w-96 h-96 rounded-full bg-radial from-gold/20 to-transparent to-70%"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          as="h1"
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
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="mt-16 text-center max-w-2xl mx-auto reveal">
            <div className="bg-gray-800/30 rounded-2xl border border-gold/20 p-12">
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
          </div>
        )}
      </div>
    </section>
  );
}
