import type { Route } from "next";
import Button from "@/components/ui/Button";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import Heading from "@/components/ui/Heading";
import BlogCard from "@/components/blog/BlogCard";
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
          text="Tips and insights for small business owners"
        >
          From the Blog
        </Heading>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} as="h3" />
          ))}
        </div>

        {/* View All Posts */}
        <div className="mt-12 text-center">
          <Button href={"/blog" as Route} variant="secondary" size="lg">
            View All Posts
            <span aria-hidden="true">&rarr;</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
