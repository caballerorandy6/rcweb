import ManageSubscription from "@/components/sections/ManageSubscription";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { siteConfig } from "@/config/site";

export const metadata = genPageMetadata({
  title: "Manage Subscription",
  description:
    "Manage your RC Web Solutions subscription. Update payment methods, view billing history, or cancel your subscription.",
  pageRoute: "/manage-subscription",
});

type SearchParams = Promise<{ error?: string }>;

export default async function ManageSubscriptionPage(props: { searchParams: SearchParams }) {
  const { error } = await props.searchParams;
  return (
    <section id="manage-subscription">
      <JsonLdForBreadcrumb
        itemList={[
          { name: "Home", item: siteConfig.baseUrl },
          { name: "Manage Subscription", item: `${siteConfig.baseUrl}/manage-subscription` },
        ]}
      />
      <ManageSubscription error={error} />
    </section>
  );
}
