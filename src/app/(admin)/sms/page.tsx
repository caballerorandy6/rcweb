import { Suspense } from "react";
import SendSmsCampaign from "@/app/components/admin/SendSmsCampaign";
import SmsDeliveryStats from "@/app/components/admin/SmsDeliveryStats";
import CampaignSkeleton from "@/app/components/skeletons/CampaignSkeleton";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { getSmsStatsAction } from "@/actions/stats/getSmsStatsAction";
import SmsTabs from "@/app/components/admin/SmsTabs";

// Increase timeout for large SMS campaigns (5 minutes)
export const maxDuration = 300;

export const metadata = genPageMetadata({
  title: "SMS Campaigns",
  description: "Send SMS campaigns for RC Web Solutions LLC.",
  pageRoute: "/sms",
});

async function SMSContent() {
  const stats = await getSmsStatsAction();
  return (
    <SmsTabs>
      <SendSmsCampaign initialStats={stats} />
      <SmsDeliveryStats />
    </SmsTabs>
  );
}

export default async function SMSPage() {
  const session = await auth();

  // Doble verificación (el middleware ya lo hace, pero por seguridad)
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <Suspense fallback={<CampaignSkeleton />}>
      <SMSContent />
    </Suspense>
  );
}
