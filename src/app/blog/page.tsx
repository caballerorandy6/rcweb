import { genPageMetadata } from "@/utils/genPageMetadata";
import { siteConfig } from "@/config/site";
import { BookOpenIcon } from "@heroicons/react/24/outline";

export const metadata = genPageMetadata({
  title: "Blog & Insights - Web Development Articles",
  description:
    "Stay updated with the latest web development trends, tips, and insights from RC Web Solutions LLC. Follow our LinkedIn page for daily posts about Next.js, React, and modern web technologies.",
  pageRoute: "/blog",
});

export default function BlogPage() {
  return (
    <section className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-gradient-to-r from-gold/20 to-gold/10 p-4">
            <BookOpenIcon className="h-12 w-12 text-gold" />
          </div>
        </div>

        <h1 className="font-iceland text-4xl font-bold tracking-tight text-gold sm:text-6xl">
          Blog & Insights
        </h1>

        <p className="mt-6 font-inter text-lg leading-8 text-white/80 mx-auto">
          Follow our journey and stay updated with the latest in web
          development, technology trends, and digital solutions.
        </p>

        <div className="mt-12 rounded-2xl border border-gold/20 bg-gray-900/50 p-8 backdrop-blur-sm">
          <h2 className="font-iceland text-2xl font-semibold text-gold">
            Connect with us on LinkedIn
          </h2>
          <p className="mt-4 font-inter text-white/70">
            We share daily posts, insights, and updates about web development,
            Next.js, React, and modern technologies on our LinkedIn company
            page.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold to-gold/80 px-6 py-3 font-inter text-sm font-semibold text-gray-900 transition-all duration-200 hover:from-gold/90 hover:to-gold/70 hover:shadow-lg hover:shadow-gold/20"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
              </svg>
              Follow us on LinkedIn
            </a>

            <a
              href={`${siteConfig.social.linkedin}/posts`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-transparent px-6 py-3 font-inter text-sm font-semibold text-gold transition-all duration-200 hover:border-gold/50 hover:bg-gold/5"
            >
              View Latest Posts
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gold/10 bg-gray-900/30 p-6 backdrop-blur-sm">
            <h3 className="font-iceland text-lg font-semibold text-gold">
              Daily Updates
            </h3>
            <p className="mt-2 font-inter text-sm text-white/60">
              Fresh content about web development trends and best practices
            </p>
          </div>

          <div className="rounded-xl border border-gold/10 bg-gray-900/30 p-6 backdrop-blur-sm">
            <h3 className="font-iceland text-lg font-semibold text-gold">
              Tech Insights
            </h3>
            <p className="mt-2 font-inter text-sm text-white/60">
              Deep dives into Next.js, React, and modern web technologies
            </p>
          </div>

          <div className="rounded-xl border border-gold/10 bg-gray-900/30 p-6 backdrop-blur-sm">
            <h3 className="font-iceland text-lg font-semibold text-gold">
              Industry News
            </h3>
            <p className="mt-2 font-inter text-sm text-white/60">
              Stay informed about the latest in digital transformation
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
