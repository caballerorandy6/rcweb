import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { siteConfig } from "@/config/site";
import BackLink from "@/components/ui/BackLink";
import ProjectsList from "@/components/sections/ProjectsList";
import { projects } from "@/lib/data";

export const metadata = genPageMetadata({
  title: "Projects & Case Studies | Houston Web Development Portfolio",
  description:
    "View our portfolio of Houston web development projects. Case studies from clinics, HVAC companies, home services, and more. Real results for real businesses.",
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
      <main className="bg-gray-950 min-h-screen">
        <BackLink href="/#projects" label="Back to Home" />
        <section className="pt-8 pb-20 sm:pt-12 sm:pb-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-iceland">
                Projects & <span className="text-gold">Case Studies</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300 font-inter">
                Real websites built for real Houston businesses. Click
                &ldquo;Case Study&rdquo; on any project to see the full story —
                challenges, solutions, and results.
              </p>
            </div>

            <ProjectsList projects={projects} />
          </div>
        </section>
      </main>
    </>
  );
}
