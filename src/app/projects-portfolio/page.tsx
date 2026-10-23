import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { siteConfig } from "@/config/site";
import BackLink from "@/components/ui/BackLink";
import ProjectsList from "@/components/sections/ProjectsList";
import { projects } from "@/lib/data";

export const metadata = genPageMetadata({
  title: "Projects & Case Studies | Web Development Portfolio",
  description:
    "Websites and web apps I have built for small businesses: clinics, HVAC, home services, event rentals and more. Most are in the Houston area; all are real results for real businesses.",
  pageRoute: "/projects-portfolio",
});

export default function ProjectsPortfolioPage() {
  return (
    <>
      <JsonLdForBreadcrumb
        itemList={[
          { name: "Home", item: siteConfig.baseUrl },
          { name: "Projects", item: `${siteConfig.baseUrl}/projects-portfolio` },
        ]}
      />
      <div className="bg-gray-950 min-h-screen">
        <BackLink href="/#projects" label="Back to Home" />
        <section className="pt-8 pb-20 sm:pt-12 sm:pb-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h1 className="text-4xl tracking-tight text-white sm:text-6xl font-iceland">
                Projects & <span className="text-gold">Case Studies</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300 font-inter">
                Real websites built for real small businesses. Click
                &ldquo;Case Study&rdquo; on any project to see the full story —
                challenges, solutions, and results.
              </p>
            </div>

            <ProjectsList projects={projects} priorityCount={3} />
          </div>
        </section>
      </div>
    </>
  );
}
