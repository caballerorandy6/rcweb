import { Suspense } from "react";
import ProjectManagement from "@/app/components/ProjectManagement";
import Spinner from "@/app/components/Spinner";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const ProjectManagementPage = async () => {
  const session = await auth();

  // Doble verificación (el middleware ya lo hace, pero por seguridad)
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <Suspense fallback={<Spinner />}>
      <ProjectManagement />
    </Suspense>
  );
};

export default ProjectManagementPage;
