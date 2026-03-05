import { getRevenueAttributionAction } from "@/actions/stats/getRevenueAttributionAction";
import {
  CurrencyDollarIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";

// Format cents to dollars
function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

// Source labels
const sourceLabels: Record<string, string> = {
  contact_form: "Contact Form",
  guide_download: "Guide Download",
  exit_intent: "Exit Intent",
  blog_subscription: "Blog Subscription",
  whatsapp: "WhatsApp",
  schedule_call: "Schedule Call",
  sms_opt_in: "SMS Opt-In",
  manual: "Manual Entry",
  unknown: "Unknown",
};

// Colors for sources
const sourceColors: Record<string, string> = {
  contact_form: "#3B82F6",
  guide_download: "#10B981",
  exit_intent: "#F59E0B",
  blog_subscription: "#A855F7",
  whatsapp: "#22C55E",
  schedule_call: "#EC4899",
  sms_opt_in: "#06B6D4",
  manual: "#6B7280",
  unknown: "#9CA3AF",
};

export default async function RevenueAttribution() {
  const data = await getRevenueAttributionAction();

  const hasData = data.totalPaidPayments > 0;

  return (
    <div className="bg-gray-800/80 rounded-xl p-4 sm:p-6 border border-gray-700/50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-5">
        <div className="flex items-center gap-3">
          <CurrencyDollarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gold flex-shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold text-white font-iceland">
            Revenue Attribution
          </h2>
        </div>
        <div className="sm:ml-auto text-sm font-inter">
          <span className="text-gray-400">Total: </span>
          <span className="text-green-400 font-bold text-lg font-iceland">
            {formatCurrency(data.totalRevenue)}
          </span>
        </div>
      </div>

      {hasData ? (
        <div className="grid md:grid-cols-2 gap-6">
          {/* By Lead Source */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ChartPieIcon className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-300 font-inter">By Lead Source</h3>
            </div>
            <div className="space-y-2.5">
              {data.byLeadSource.map((source) => {
                const label = sourceLabels[source.source] || source.source;
                const color = sourceColors[source.source] || "#6B7280";
                return (
                  <div key={source.source} className="font-inter">
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <span className="text-xs sm:text-sm text-gray-300 truncate">{label}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs sm:text-sm font-bold text-green-400">
                          {formatCurrency(source.revenue)}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-500">
                          ({source.count})
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(source.percentage, 3)}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              {data.byLeadSource.length === 0 && (
                <p className="text-sm text-gray-500 font-inter">No attributed revenue yet</p>
              )}
            </div>
          </div>

          {/* By UTM Source */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CurrencyDollarIcon className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-300 font-inter">By Campaign Source</h3>
            </div>
            {data.byUTMSource.length > 0 ? (
              <div className="space-y-2">
                {data.byUTMSource.map((utm) => (
                  <div
                    key={utm.utmSource}
                    className="flex items-center justify-between p-2.5 bg-gray-700/30 rounded-lg font-inter"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white capitalize">{utm.utmSource}</p>
                      <p className="text-xs text-gray-500">{utm.count} payment{utm.count !== 1 ? "s" : ""}</p>
                    </div>
                    <span className="text-sm font-bold text-green-400 ml-2">
                      {formatCurrency(utm.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-gray-700/20 rounded-lg text-center">
                <p className="text-sm text-gray-500 font-inter">No UTM-attributed revenue yet</p>
                <p className="text-xs text-gray-600 font-inter mt-1">
                  Revenue from UTM campaigns will appear here
                </p>
              </div>
            )}

            {/* Unattributed */}
            {data.unattributed.count > 0 && (
              <div className="mt-3 p-2.5 bg-gray-700/20 rounded-lg font-inter border border-dashed border-gray-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Unattributed</p>
                    <p className="text-xs text-gray-500">{data.unattributed.count} payment{data.unattributed.count !== 1 ? "s" : ""}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-400">
                    {formatCurrency(data.unattributed.revenue)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <CurrencyDollarIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-inter text-sm sm:text-base">No revenue data yet</p>
          <p className="text-xs sm:text-sm text-gray-500 font-inter mt-1">
            Revenue attribution will appear when payments are linked to contacts
          </p>
        </div>
      )}

      {/* Legend */}
      {hasData && (
        <div className="mt-5 pt-4 border-t border-gray-700/50">
          <p className="text-[10px] sm:text-xs text-gray-500 font-inter">
            Revenue is attributed by linking payments to contacts via email. Use the link function when creating payments.
          </p>
        </div>
      )}
    </div>
  );
}
