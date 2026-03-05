import { getProjectStatsAction } from "@/actions/projects/getProjectStatsAction";
import { getRevenueStatsAction } from "@/actions/stats/getRevenueStatsAction";
import { getNewLeadsAction } from "@/actions/stats/getNewLeadsAction";
import { getTotalContactsAction } from "@/actions/contacts/getTotalContactsAction";
import {
  CurrencyDollarIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  SparklesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

function formatCurrency(amount: number): string {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`;
  }
  return `$${amount}`;
}

export default async function StatsGrid() {
  // Fetch all stats in parallel
  const [projectStats, revenueStats, newLeadsStats, totalContacts] =
    await Promise.all([
      getProjectStatsAction(),
      getRevenueStatsAction(),
      getNewLeadsAction(),
      getTotalContactsAction(),
    ]);

  const activeProjects =
    projectStats?.success && projectStats.data
      ? projectStats.data.stats.inProgress
      : 0;

  const statsCards = [
    {
      label: "Revenue (Month)",
      value: formatCurrency(revenueStats.thisMonthRevenue),
      subtext:
        revenueStats.totalRevenue > 0
          ? `Total: ${formatCurrency(revenueStats.totalRevenue)}`
          : null,
      icon: <CurrencyDollarIcon className="w-7 h-7 sm:w-8 sm:h-8 text-green-400" />,
    },
    {
      label: "Active Projects",
      value: activeProjects,
      subtext: projectStats?.success
        ? `${projectStats.data?.stats.awaitingPayment || 0} awaiting payment`
        : null,
      icon: <BriefcaseIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" />,
    },
    {
      label: "Pending Invoices",
      value: revenueStats.pendingPayments,
      subtext:
        revenueStats.pendingAmount > 0
          ? formatCurrency(revenueStats.pendingAmount)
          : null,
      icon: <DocumentTextIcon className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-400" />,
    },
    {
      label: "New Leads",
      value: newLeadsStats.thisWeek,
      subtext:
        newLeadsStats.trend !== "same"
          ? `${newLeadsStats.trend === "up" ? "↑" : "↓"} ${Math.abs(newLeadsStats.percentChange)}% vs last week`
          : "Same as last week",
      icon: <SparklesIcon className="w-7 h-7 sm:w-8 sm:h-8 text-purple-400" />,
    },
    {
      label: "Total Contacts",
      value: totalContacts.toLocaleString(),
      icon: <UserGroupIcon className="w-7 h-7 sm:w-8 sm:h-8 text-gold" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 font-inter">
      {statsCards.map((card, i) => (
        <div
          key={i}
          className="bg-gray-800/80 rounded-xl p-4 sm:p-5 border border-gray-700/50 hover:border-gray-600 transition-colors"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-gray-400 text-xs sm:text-sm truncate">
                {card.label}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-1">
                {card.value}
              </p>
              {card.subtext && (
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1 truncate">
                  {card.subtext}
                </p>
              )}
            </div>
            <div className="flex-shrink-0">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
