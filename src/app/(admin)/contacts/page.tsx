import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ContactManagement from "@/app/components/admin/ContactManagement";
import ContactManagementSkeleton from "@/app/components/skeletons/ContactManagementSkeleton";
import { getContactsAction } from "@/actions/contacts/getContactsAction";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata = genPageMetadata({
  title: "Contact Management",
  description: "Manage contacts for RC Web Solutions LLC admin panel.",
  pageRoute: "/contacts",
});

async function ContactManagementWrapper() {
  const result = await getContactsAction();
  const contacts = result.success ? result.contacts || [] : [];

  return <ContactManagement initialContacts={contacts} />;
}

export default async function ContactsPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <Suspense fallback={<ContactManagementSkeleton />}>
      <ContactManagementWrapper />
    </Suspense>
  );
}
