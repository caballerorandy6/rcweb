import SubscriptionManagementWrapper from "@/app/components/wrappers/SubscriptionManagementWrapper";
import SubscriptionManagementSkeleton from "@/app/components/skeletons/SubscriptionManagementSkeleton";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata = genPageMetadata({
  title: "Subscription Management",
  description: "Manage subscriptions for RC Web Solutions LLC.",
  pageRoute: "/subscriptions",
  noIndex: true,
});

export default async function SubscriptionsPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-iceland text-gold">Subscription Management</h1>
        <p className="text-gray-400 mt-2 font-inter">View and manage recurring subscriptions</p>
      </div>

      <Suspense fallback={<SubscriptionManagementSkeleton />}>
        <SubscriptionManagementWrapper />
      </Suspense>
    </div>
  );
}
