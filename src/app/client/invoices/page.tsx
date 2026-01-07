import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getClientInvoicesAction } from "@/actions/invoices/getClientInvoicesAction";
import ClientInvoices from "@/app/components/client/ClientInvoices";
import { genPageMetadata } from "@/utils/genPageMetadata";
import type { Route } from "next";

export const metadata: Metadata = genPageMetadata({
  title: "My Invoices - Client Portal",
  description: "View and download all your invoices from RC Web Solutions.",
  pageRoute: "/client/invoices",
});

export default async function ClientInvoicesPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "CLIENT") {
    redirect("/client/login" as Route);
  }

  const result = await getClientInvoicesAction();

  if (!result.success || !result.data) {
    redirect("/client/login" as Route);
  }

  return (
    <section id="client-invoices">
      <ClientInvoices
        invoices={result.data.invoices}
        projects={result.data.projects}
      />
    </section>
  );
}

