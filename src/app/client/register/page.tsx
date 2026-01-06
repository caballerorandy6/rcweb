import { Metadata } from "next";
import ClientRegisterForm from "@/app/components/client/ClientRegisterForm";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata: Metadata = genPageMetadata({
  title: "Client Registration - RC Web Solutions",
  description:
    "Create your client account to access your projects and invoices.",
  pageRoute: "/client/register",
});

export default function ClientRegisterPage() {
  return (
    <section id="client-register">
      <ClientRegisterForm />
    </section>
  );
}
