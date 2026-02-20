import SubscriptionManagement from "@/components/admin/SubscriptionManagement";
import { getAllSubscriptionsAction } from "@/actions/subscriptions/getAllSubscriptionsAction";

export default async function SubscriptionManagementWrapper() {
  const result = await getAllSubscriptionsAction();
  const subscriptions =
    result.success && result.data ? result.data.subscriptions : [];

  return <SubscriptionManagement initialSubscriptions={subscriptions} />;
}
