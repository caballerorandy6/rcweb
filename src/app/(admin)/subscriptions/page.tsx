import SubscriptionManagementWrapper from "@/components/wrappers/SubscriptionManagementWrapper";
import SubscriptionManagementSkeleton from "@/components/skeletons/SubscriptionManagementSkeleton";
import { Suspense } from "react";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata = genPageMetadata({
  title: "Subscription Management",
  description: "Manage subscriptions for RC Web Solutions LLC.",
  pageRoute: "/subscriptions",
  noIndex: true,
});

// Always rendered per request (the actions read the session from headers)
export const dynamic = "force-dynamic";

export default function SubscriptionsPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-iceland text-gold">Subscription Management</h1>
        <p className="text-gray-400 mt-2 font-inter">View and manage recurring subscriptions</p>
      </div>

      <Suspense fallback={<SubscriptionManagementSkeleton />}>
        <SubscriptionManagementWrapper />
      </Suspense>
    </div>
  );
}
