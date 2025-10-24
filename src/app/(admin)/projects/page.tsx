import ProjectManagement from "@/app/components/admin/ProjectManagement";
import ProjectManagementSkeleton from "@/app/components/skeletons/ProjectManagementSkeleton";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getAllProjectsAction } from "@/actions/projects/getAllProjectsAction";
import { getProjectStatsAction } from "@/actions/projects/getProjectStatsAction";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata = genPageMetadata({
  title: "Project Management",
  description: "Manage projects and track progress for RC Web Solutions LLC.",
  pageRoute: "/projects",
});

async function ProjectManagementWrapper() {
  const [projectsResult, statsResult] = await Promise.all([
    getAllProjectsAction(),
    getProjectStatsAction(),
  ]);

  const projects = projectsResult.success
    ? projectsResult.projects!.map((project) => ({
        ...project,
        createdAt:
          typeof project.createdAt === "string"
            ? project.createdAt
            : project.createdAt.toISOString(),
      }))
    : [];

  const stats = statsResult.success ? statsResult.stats! : null;

  return <ProjectManagement initialProjects={projects} initialStats={stats} />;
}

export default async function ProjectManagementPage() {
  const session = await auth();

  // Doble verificación (el middleware ya lo hace, pero por seguridad)
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <Suspense fallback={<ProjectManagementSkeleton />}>
      <ProjectManagementWrapper />
    </Suspense>
  );
}
