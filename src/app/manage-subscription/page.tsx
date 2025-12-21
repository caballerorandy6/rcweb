import ManageSubscription from "@/app/components/sections/ManageSubscription";
import { JsonLdForBreadcrumb } from "@/app/components/seo/JsonLdForBreadcrumb";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { siteConfig } from "@/config/site";

export const metadata = genPageMetadata({
  title: "Manage Subscription",
  description:
    "Manage your RC Web Solutions subscription. Update payment methods, view billing history, or cancel your subscription.",
  pageRoute: "/manage-subscription",
});

export default function ManageSubscriptionPage() {
  return (
    <section id="manage-subscription">
      <JsonLdForBreadcrumb
        itemList={[
          { name: "Home", item: siteConfig.baseUrl },
          { name: "Manage Subscription", item: `${siteConfig.baseUrl}/manage-subscription` },
        ]}
      />
      <ManageSubscription />
    </section>
  );
}
