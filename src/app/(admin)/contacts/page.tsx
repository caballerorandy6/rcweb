import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Spinner from "@/app/components/Spinner";
import ContactManagement from "@/app/components/ContactManagement";

const ContactsPage = async () => {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <section id="contact-management">
      <Suspense fallback={<Spinner />}>
        <ContactManagement />
      </Suspense>
    </section>
  );
};

export default ContactsPage;
