import { Suspense } from "react";
import Link from "next/link";
import ProjectManagement from "@/components/admin/ProjectManagement";
import ProjectManagementSkeleton from "@/components/skeletons/ProjectManagementSkeleton";
import { getAllProjectsAction } from "@/actions/projects/getAllProjectsAction";
import { getProjectStatsAction } from "@/actions/projects/getProjectStatsAction";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata = genPageMetadata({
  title: "Projects",
  description: "Manage projects and track progress for RC Web Solutions LLC.",
  pageRoute: "/projects",
  noIndex: true,
});

// Always rendered per request (the actions read the session from headers)
export const dynamic = "force-dynamic";

// The admin layout already checks the session; the actions check it again.
async function ProjectList() {
  const [projectsResult, statsResult] = await Promise.all([
    getAllProjectsAction(),
    getProjectStatsAction(),
  ]);

  if (!projectsResult.success) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 font-inter">
        <p className="text-red-400">{projectsResult.error}</p>
        <Link href="/admin-dashboard" className="text-gold hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <ProjectManagement
      projects={projectsResult.data.projects}
      stats={statsResult.success ? statsResult.data.stats : null}
    />
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectManagementSkeleton />}>
      <ProjectList />
    </Suspense>
  );
}
