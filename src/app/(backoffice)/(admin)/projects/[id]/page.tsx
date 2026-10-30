import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { adminProjectDetailInclude, toAdminProjectDetail } from "@/lib/project/toAdminProjectDetail";
import ProjectDetail from "@/components/admin/ProjectDetail";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata = genPageMetadata({
  title: "Project",
  description: "Customer, payments, invoices, links and milestones of one project.",
  pageRoute: "/projects",
  noIndex: true,
});

type Params = Promise<{ id: string }>;

// The admin layout already checks the session
export default async function ProjectPage(props: { params: Params }) {
  const { id } = await props.params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: adminProjectDetailInclude,
  });
  if (!project) notFound();

  return <ProjectDetail project={toAdminProjectDetail(project)} />;
}
