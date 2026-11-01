import { Suspense } from "react";
import Link from "next/link";
import ContactManagement from "@/components/admin/ContactManagement";
import ContactManagementSkeleton from "@/components/skeletons/ContactManagementSkeleton";
import { getContactsAction } from "@/actions/contacts/getContactsAction";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { serviceOptions } from "@/lib/data";

export const metadata = genPageMetadata({
  title: "Contacts",
  description: "Manage contacts and leads for RC Web Solutions LLC.",
  pageRoute: "/contacts",
  noIndex: true,
});

// Always rendered per request (the actions read the session from headers)
export const dynamic = "force-dynamic";

type ContactsPageProps = {
  // `?action=new` (the dashboard's "Add Contact" shortcut) opens the form
  searchParams: Promise<{ action?: string }>;
};

// The admin layout already checks the session; the actions check it again.
async function ContactList({ openNew }: { openNew: boolean }) {
  const result = await getContactsAction();

  if (!result.success) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 font-inter">
        <p className="text-red-400">{result.error}</p>
        <Link href="/admin-dashboard" className="text-gold hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <ContactManagement
      contacts={result.data.contacts}
      serviceOptions={serviceOptions}
      openNew={openNew}
    />
  );
}

export default async function ContactsPage({ searchParams }: ContactsPageProps) {
  const { action } = await searchParams;

  return (
    <Suspense fallback={<ContactManagementSkeleton />}>
      <ContactList openNew={action === "new"} />
    </Suspense>
  );
}
