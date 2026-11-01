import { CodeBracketIcon } from "@heroicons/react/24/outline";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import { getTranslations } from "next-intl/server";
import { teachMarqueeData } from "@/lib/data";
import { getLocalizedCatalog } from "@/lib/catalog";
import ProjectsList from "@/components/sections/ProjectsList";
import TechMarquee from "@/components/ui/TechMarquee";

const FEATURED_COUNT = 3;

// Server Component
const Projects = async () => {
  const [t, { projects }] = await Promise.all([
    getTranslations("Home.projects"),
    getLocalizedCatalog(),
  ]);

  // Show only projects that have case studies (real clients)
  const featuredProjects = projects
    .filter((p) => p.caseStudy)
    .slice(0, FEATURED_COUNT);

  // Fallback to first 3 if none have case studies
  const displayProjects =
    featuredProjects.length > 0
      ? featuredProjects
      : projects.slice(0, FEATURED_COUNT);

  return (
    <section id="projects" className="pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<CodeBracketIcon className="w-8 text-gold" />}
          text={t("subheading")}
        >
          {t("heading")}
        </Heading>

        <ProjectsList projects={displayProjects} />

        {/* View All Projects */}
        <div className="flex justify-center mt-12">
          <Button
            href="/projects-portfolio"
            variant="secondary"
            size="lg"
          >
            {t("viewAll", { count: projects.length })}
            <span aria-hidden="true">&rarr;</span>
          </Button>
        </div>

        <div className="mt-16 sm:mt-20 pt-12">
          <TechMarquee items={teachMarqueeData} />
        </div>
      </div>
    </section>
  );
};

export default Projects;
