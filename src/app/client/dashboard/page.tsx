import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getClientProjectsAction } from "@/actions/projects/getClientProjectsAction";
import ClientDashboard from "@/components/client/ClientDashboard";
import { genPageMetadata } from "@/utils/genPageMetadata";
import type { Route } from "next";

export const metadata: Metadata = genPageMetadata({
  title: "Client Dashboard - RC Web Solutions",
  description: "View all your projects, invoices, and project progress.",
  pageRoute: "/client/dashboard",
});

export default async function ClientDashboardPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "CLIENT") {
    redirect("/client/login" as Route);
  }

  const result = await getClientProjectsAction();

  if (!result.success || !result.data) {
    redirect("/client/login" as Route);
  }

  return (
    <section id="client-dashboard">
      <ClientDashboard
        clientName={session.user.name || "Client"}
        projects={result.data.projects}
      />
    </section>
  );
}
