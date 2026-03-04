import { getTotalContactsAction } from "@/actions/contacts/getTotalContactsAction";
import { getMarketingConsentAction } from "@/actions/campaigns/getMarketingConsentAction";
import { getTotalEmailsSentAction } from "@/actions/stats/getTotalEmailsSentAction";
import { getTotalSMSsentAction } from "@/actions/stats/getTotalSMSSentAction";
import { getProjectStatsAction } from "@/actions/projects/getProjectStatsAction";
import {
  UserGroupIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

export default async function StatsGrid() {
  // Fetch all stats in parallel
  const [
    totalContacts,
    totalMarketingConsent,
    totalEmailsSent,
    totalSMSsent,
    projectStats,
  ] = await Promise.all([
    getTotalContactsAction(),
    getMarketingConsentAction(),
    getTotalEmailsSentAction(),
    getTotalSMSsentAction(),
    getProjectStatsAction(),
  ]);

  const stats = {
    totalContacts,
    totalMarketingConsent,
    totalEmailsSent,
    totalSMSsent,
    totalProjects:
      projectStats?.success && projectStats.data
        ? projectStats.data.stats.total
        : 0,
  };

  const statsCards = [
    {
      label: "Total Contacts",
      value: stats.totalContacts,
      icon: <UserGroupIcon className="w-8 h-8 text-gold" />,
    },
    {
      label: "Marketing Consent",
      value: stats.totalMarketingConsent,
      icon: <CheckCircleIcon className="w-8 h-8 text-green-400" />,
    },
    {
      label: "Emails Sent",
      value: stats.totalEmailsSent,
      icon: <EnvelopeIcon className="w-8 h-8 text-blue-400" />,
    },
    {
      label: "SMS Sent",
      value: stats.totalSMSsent,
      icon: <ChatBubbleLeftRightIcon className="w-8 h-8 text-purple-400" />,
    },
    {
      label: "Projects",
      value: stats.totalProjects,
      icon: <BriefcaseIcon className="w-8 h-8 text-yellow-400" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 font-inter">
      {statsCards.map((card, i) => (
        <div
          key={i}
          className="bg-gray-800/80 rounded-xl p-4 sm:p-5 border border-gray-700/50 hover:border-gray-600 transition-colors"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-gray-400 text-xs sm:text-sm truncate">{card.label}</p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{card.value}</p>
            </div>
            <div className="flex-shrink-0">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
