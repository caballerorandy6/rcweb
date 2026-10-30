import { Suspense } from "react";
import Newsletter from "@/components/admin/SendNewsletterCampaign";
import CampaignSkeleton from "@/components/skeletons/CampaignSkeleton";
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

// Always rendered per request (the actions read the session from headers)
export const dynamic = "force-dynamic";

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

export default function NewsletterPage() {
  return (
    <Suspense fallback={<CampaignSkeleton />}>
      <NewsletterContent />
    </Suspense>
  );
}
