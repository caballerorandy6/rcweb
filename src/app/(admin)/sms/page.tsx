import { Suspense } from "react";
import SendSmsCampaign from "@/app/components/SendSmsCampaign";
import CampaignSkeleton from "@/app/components/CampaignSkeleton";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { getSmsStatsAction } from "@/actions/getSmsStatsAction";

export const metadata = genPageMetadata({
  title: "SMS Campaigns",
  description: "Send SMS campaigns for RC Web Solutions LLC.",
  pageRoute: "/sms",
});

async function SMSContent() {
  const stats = await getSmsStatsAction();
  return <SendSmsCampaign initialStats={stats} />;
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
