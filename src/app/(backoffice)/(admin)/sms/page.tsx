import { Suspense } from "react";
import SendSmsCampaign from "@/components/admin/SendSmsCampaign";
import SmsDeliveryStats from "@/components/admin/SmsDeliveryStats";
import CampaignSkeleton from "@/components/skeletons/CampaignSkeleton";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { getSmsStatsAction } from "@/actions/stats/getSmsStatsAction";
import SmsTabs from "@/components/admin/SmsTabs";

// Increase timeout for large SMS campaigns (5 minutes)
export const maxDuration = 300;

export const metadata = genPageMetadata({
  title: "SMS Campaigns",
  description: "Send SMS campaigns for RC Web Solutions LLC.",
  pageRoute: "/sms",
  noIndex: true,
});

// Always rendered per request (the actions read the session from headers)
export const dynamic = "force-dynamic";

async function SMSContent() {
  const stats = await getSmsStatsAction();
  return (
    <SmsTabs>
      <SendSmsCampaign initialStats={stats} />
      <SmsDeliveryStats />
    </SmsTabs>
  );
}

export default function SMSPage() {
  return (
    <Suspense fallback={<CampaignSkeleton />}>
      <SMSContent />
    </Suspense>
  );
}
