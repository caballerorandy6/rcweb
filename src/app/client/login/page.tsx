import { Metadata } from "next";
import { Suspense } from "react";
import ClientLoginForm from "@/app/components/client/ClientLoginForm";
import ClientLoginSkeleton from "@/app/components/skeletons/ClientLoginSkeleton";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata: Metadata = genPageMetadata({
  title: "Client Login - RC Web Solutions",
  description: "Login to access your client portal and view your projects.",
  pageRoute: "/client/login",
});

export default function ClientLoginPage() {
  return (
    <section id="client-login">
      <Suspense fallback={<ClientLoginSkeleton />}>
        <ClientLoginForm />
      </Suspense>
    </section>
  );
}
