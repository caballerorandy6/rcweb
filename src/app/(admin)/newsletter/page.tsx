import { Suspense } from "react";
import Newsletter from "@/app/components/admin/SendNewsletterCampaign";
import CampaignSkeleton from "@/app/components/skeletons/CampaignSkeleton";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { genPageMetadata } from "@/utils/genPageMetadata";
import {
  getNumberOfEligibleContactsAction,
  getNumberOfEligibleEmailsAction,
} from "@/actions/stats/getNewsletterStatsAction";
import { getAllCampaigns } from "@/actions/campaigns/sendBatchNewsletterAction";

export const metadata = genPageMetadata({
  title: "Newsletter Campaigns",
  description: "Send newsletter campaigns for RC Web Solutions LLC.",
  pageRoute: "/newsletter",
  noIndex: true,
});

async function NewsletterContent() {
  const [contactsData, emailsData, campaignsData] = await Promise.all([
    getNumberOfEligibleContactsAction(),
    getNumberOfEligibleEmailsAction(),
    getAllCampaigns(),
  ]);

  const initialStats = {
    contacts: {
      eligible: contactsData.eligible ?? 0,
      total: contactsData.total ?? 0,
      percentage: contactsData.percentage ?? 0,
    },
    emails: {
      eligible: emailsData.eligibleEmails ?? 0,
      total: emailsData.totalEmails ?? 0,
      percentage: emailsData.consentPercentage ?? 0,
    },
  };

  const initialCampaigns = campaignsData.success ? campaignsData.campaigns : [];

  return (
    <Newsletter initialStats={initialStats} initialCampaigns={initialCampaigns} />
  );
}

export default async function NewsletterPage() {
  const session = await auth();

  // Doble verificación (el middleware ya lo hace, pero por seguridad)
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <Suspense fallback={<CampaignSkeleton />}>
      <NewsletterContent />
    </Suspense>
  );
}
