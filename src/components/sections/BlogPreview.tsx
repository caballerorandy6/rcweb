import Button from "@/components/ui/Button";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import Heading from "@/components/ui/Heading";
import BlogCard from "@/components/blog/BlogCard";
import { getLocale, getTranslations } from "next-intl/server";
import { getAllPosts } from "@/lib/blog";

export default async function BlogPreview() {
  const [t, locale] = await Promise.all([getTranslations("Home.blog"), getLocale()]);
  const posts = getAllPosts(locale).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section
      id="blog"
      className="relative isolate overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-24 bg-gray-900"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<BookOpenIcon className="w-8 text-gold" />}
          text={t("subheading")}
        >
          {t("heading")}
        </Heading>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} as="h3" />
          ))}
        </div>

        {/* View All Posts */}
        <div className="mt-12 text-center">
          <Button href="/blog" variant="secondary" size="lg">
            {t("viewAll")}
            <span aria-hidden="true">&rarr;</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
