import { getProjectStatsAction } from "@/actions/projects/getProjectStatsAction";
import { formatCurrency } from "@/lib/utils";
import { getRevenueStatsAction } from "@/actions/stats/getRevenueStatsAction";
import { getNewLeadsAction } from "@/actions/stats/getNewLeadsAction";
import { getOpenQuotesStatsAction } from "@/actions/stats/getOpenQuotesStatsAction";
import {
  CurrencyDollarIcon,
  BriefcaseIcon,
  BanknotesIcon,
  SparklesIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

// Whole dollars: the cards are narrow and cents add nothing here
const money = (cents: number) => formatCurrency(cents, true);

export default async function StatsGrid() {
  // Fetch all stats in parallel
  const [projectStats, revenueStats, newLeadsStats, quoteStats] =
    await Promise.all([
      getProjectStatsAction(),
      getRevenueStatsAction(),
      getNewLeadsAction(),
      getOpenQuotesStatsAction(),
    ]);

  const activeProjects =
    projectStats?.success && projectStats.data
      ? projectStats.data.stats.inProgress
      : 0;

  const statsCards = [
    {
      label: "Revenue (Month)",
      value: money(revenueStats.thisMonthRevenue),
      subtext:
        revenueStats.totalRevenue > 0
          ? `Total: ${money(revenueStats.totalRevenue)}`
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
      // Charges still due (final payments of projects marked ready), not invoices
      label: "Payments Due",
      value: revenueStats.pendingPayments,
      subtext:
        revenueStats.pendingAmount > 0
          ? money(revenueStats.pendingAmount)
          : null,
      icon: <BanknotesIcon className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-400" />,
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
      // Pipeline: sent quotes still open, and what they add up to
      label: "Open Quotes",
      value: quoteStats.open,
      subtext:
        quoteStats.open > 0
          ? `${money(quoteStats.openValue)} on the table`
          : quoteStats.drafts > 0
            ? `${quoteStats.drafts} ${quoteStats.drafts === 1 ? "draft" : "drafts"} to send`
            : null,
      icon: <ClipboardDocumentListIcon className="w-7 h-7 sm:w-8 sm:h-8 text-gold" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 font-inter">
      {statsCards.map((card) => (
        <div
          key={card.label}
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
              {card.subtext ? (
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1 truncate">
                  {card.subtext}
                </p>
              ) : null}
            </div>
            <div className="shrink-0">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
