import { Suspense } from "react";
import Link from "next/link";
import InvoiceManagement from "@/components/admin/InvoiceManagement";
import InvoiceManagementSkeleton from "@/components/skeletons/InvoiceManagementSkeleton";
import { getInvoicesAction } from "@/actions/invoices/getInvoicesAction";
import { getRevenueStatsAction } from "@/actions/stats/getRevenueStatsAction";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata = genPageMetadata({
  title: "Invoices",
  description: "Invoices generated for RC Web Solutions LLC projects.",
  pageRoute: "/manage-invoices",
  noIndex: true,
});

// Always rendered per request (the actions read the session from headers)
export const dynamic = "force-dynamic";

// The admin layout already checks the session; the actions check it again.
async function InvoiceList() {
  const [invoicesResult, revenue] = await Promise.all([
    getInvoicesAction(),
    // Revenue is a nice-to-have on this page: a failure must not hide the list
    getRevenueStatsAction().catch((error: unknown) => {
      console.error("Error fetching revenue stats:", error);
      return null;
    }),
  ]);

  if (!invoicesResult.success) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 font-inter">
        <p className="text-red-400">{invoicesResult.error}</p>
        <Link href="/admin-dashboard" className="text-gold hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return <InvoiceManagement invoices={invoicesResult.data.invoices} revenue={revenue} />;
}

export default function ManageInvoicesPage() {
  return (
    <Suspense fallback={<InvoiceManagementSkeleton />}>
      <InvoiceList />
    </Suspense>
  );
}
