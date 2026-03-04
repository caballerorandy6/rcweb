import { getLeadsBySourceAction } from "@/actions/stats/getLeadsBySourceAction";
import {
  ChartBarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

// Source labels for display
const sourceLabels: Record<string, string> = {
  contact_form: "Contact Form",
  guide_download: "Guide Download",
  exit_intent: "Exit Intent Popup",
  google_places: "Google Places Import",
  sms_opt_in: "SMS Opt-In",
  whatsapp: "WhatsApp",
  schedule_call: "Schedule Call",
  manual: "Manual Entry",
  unknown: "Unknown",
};

// Colors for each source
const sourceColors: Record<string, string> = {
  contact_form: "#3B82F6", // blue
  guide_download: "#10B981", // green
  exit_intent: "#F59E0B", // amber
  google_places: "#8B5CF6", // purple
  sms_opt_in: "#06B6D4", // cyan
  whatsapp: "#22C55E", // whatsapp green
  schedule_call: "#EC4899", // pink
  manual: "#6B7280", // gray
  unknown: "#9CA3AF", // light gray
};

export default async function LeadsBySource() {
  const data = await getLeadsBySourceAction();

  const statusCards = [
    {
      label: "New Leads",
      value: data.byStatus.NEW,
      icon: <SparklesIcon className="w-5 h-5" />,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      label: "Contacted",
      value: data.byStatus.CONTACTED,
      icon: <ClockIcon className="w-5 h-5" />,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
    },
    {
      label: "Interested",
      value: data.byStatus.INTERESTED,
      icon: <UserGroupIcon className="w-5 h-5" />,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
    {
      label: "Won",
      value: data.byStatus.WON,
      icon: <CheckCircleIcon className="w-5 h-5" />,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      label: "Lost",
      value: data.byStatus.LOST,
      icon: <XCircleIcon className="w-5 h-5" />,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
    },
  ];

  return (
    <div className="bg-gray-800/80 rounded-xl p-4 sm:p-6 border border-gray-700/50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-5">
        <div className="flex items-center gap-3">
          <ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gold flex-shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold text-white font-iceland">
            Leads by Source
          </h2>
        </div>
        <span className="sm:ml-auto text-sm text-gray-400 font-inter">
          Total: <span className="text-gold font-semibold">{data.total.toLocaleString()}</span> leads
        </span>
      </div>

      {/* Status Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-6">
        {statusCards.map((card) => (
          <div
            key={card.label}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${card.bgColor} font-inter`}
          >
            <span className={`${card.color} flex-shrink-0`}>{card.icon}</span>
            <div className="min-w-0 flex-1">
              <span className="text-xs text-gray-400 block truncate">{card.label}</span>
              <span className={`font-bold text-sm ${card.color}`}>{card.value.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Source Bars */}
      {data.sources.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {data.sources.map((source) => {
            const label =
              sourceLabels[source.source] || source.source || "Unknown";
            const color = sourceColors[source.source] || "#6B7280";

            return (
              <div key={source.source} className="font-inter">
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  <span className="text-xs sm:text-sm text-gray-300 truncate">{label}</span>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      {source.count.toLocaleString()}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-500">
                      ({source.percentage}%)
                    </span>
                  </div>
                </div>
                <div className="h-2.5 sm:h-3 bg-gray-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.max(source.percentage, 2)}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <UserGroupIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-inter text-sm sm:text-base">No leads recorded yet</p>
          <p className="text-xs sm:text-sm text-gray-500 font-inter mt-1">
            Leads will appear here as they come in from various sources
          </p>
        </div>
      )}

      {/* Legend */}
      {data.sources.length > 0 && (
        <div className="mt-5 pt-4 border-t border-gray-700/50">
          <p className="text-[10px] sm:text-xs text-gray-500 font-inter">
            Lead sources are tracked automatically from contact forms, guide
            downloads, exit intent popups, and other conversion points.
          </p>
        </div>
      )}
    </div>
  );
}
