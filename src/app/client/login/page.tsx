import { Metadata } from "next";
import ClientLoginForm from "@/app/components/client/ClientLoginForm";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata: Metadata = genPageMetadata({
  title: "Client Login - RC Web Solutions",
  description: "Login to access your client portal and view your projects.",
  pageRoute: "/client/login",
});

export default function ClientLoginPage() {
  return (
    <section id="client-login">
      <ClientLoginForm />
    </section>
  );
}
