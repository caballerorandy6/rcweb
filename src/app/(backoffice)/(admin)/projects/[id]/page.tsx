import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/authGuard";
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

export default async function ProjectPage(props: { params: Params }) {
  await requireAdminPage();
  const { id } = await props.params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: adminProjectDetailInclude,
  });
  if (!project) notFound();

  return <ProjectDetail project={toAdminProjectDetail(project)} />;
}
