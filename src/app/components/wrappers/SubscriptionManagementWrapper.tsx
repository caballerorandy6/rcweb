import SubscriptionManagement from "@/app/components/admin/SubscriptionManagement";
import { getAllSubscriptionsAction } from "@/actions/subscriptions/getAllSubscriptionsAction";

export default async function SubscriptionManagementWrapper() {
  const result = await getAllSubscriptionsAction();
  const subscriptions = result.success ? result.subscriptions! : [];

  return <SubscriptionManagement initialSubscriptions={subscriptions} />;
}
