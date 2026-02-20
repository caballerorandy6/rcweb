import { Metadata } from "next";
import { Suspense } from "react";
import { genPageMetadata } from "@/utils/genPageMetadata";
import BlogUnsubscribeForm from "@/components/blog/BlogUnsubscribeForm";
import BlogUnsubscribeSkeleton from "@/components/skeletons/BlogUnsubscribeSkeleton";

export const metadata: Metadata = genPageMetadata({
  title: "Unsubscribe from Blog - RC Web Solutions",
  description: "Unsubscribe from RC Web Solutions blog notifications.",
  pageRoute: "/blog/unsubscribe",
});

export default function BlogUnsubscribePage() {
  return (
    <section
      id="blog-unsubscribe"
      className="min-h-screen bg-gray-900 pt-24 sm:pt-32 pb-16 sm:pb-24"
    >
      <div className="mx-auto max-w-2xl px-6 lg:px-8">
        <Suspense fallback={<BlogUnsubscribeSkeleton />}>
          <BlogUnsubscribeForm />
        </Suspense>
      </div>
    </section>
  );
}

