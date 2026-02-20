import { Metadata } from "next";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import ClientLoginForm from "@/components/client/ClientLoginForm";
import ClientLoginSkeleton from "@/components/skeletons/ClientLoginSkeleton";
import DashboardRedirect from "@/components/client/DashboardRedirect";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata: Metadata = genPageMetadata({
  title: "Client Login - RC Web Solutions",
  description: "Login to access your client portal and view your projects.",
  pageRoute: "/client/login",
});

export default async function ClientLoginPage() {
  const session = await auth();

  // If already authenticated as CLIENT, show skeleton and redirect
  if (session?.user && session.user.role === "CLIENT") {
    return <DashboardRedirect />;
  }

  return (
    <section id="client-login">
      <Suspense fallback={<ClientLoginSkeleton />}>
        <ClientLoginForm />
      </Suspense>
    </section>
  );
}
