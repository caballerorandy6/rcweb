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
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <ChartBarIcon className="w-6 h-6 text-gold" />
        <h2 className="text-2xl font-bold text-white font-iceland">
          Leads by Source
        </h2>
        <span className="ml-auto text-sm text-gray-400 font-inter">
          Total: <span className="text-gold font-semibold">{data.total}</span>{" "}
          leads
        </span>
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-3 mb-6">
        {statusCards.map((card) => (
          <div
            key={card.label}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${card.bgColor} font-inter`}
          >
            <span className={card.color}>{card.icon}</span>
            <span className="text-sm text-gray-300">{card.label}:</span>
            <span className={`font-semibold ${card.color}`}>{card.value}</span>
          </div>
        ))}
      </div>

      {/* Source Bars */}
      {data.sources.length > 0 ? (
        <div className="space-y-4">
          {data.sources.map((source) => {
            const label =
              sourceLabels[source.source] || source.source || "Unknown";
            const color = sourceColors[source.source] || "#6B7280";

            return (
              <div key={source.source} className="font-inter">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-300">{label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {source.count}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({source.percentage}%)
                    </span>
                  </div>
                </div>
                <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${source.percentage}%`,
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
          <UserGroupIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-inter">No leads recorded yet</p>
          <p className="text-sm text-gray-500 font-inter mt-1">
            Leads will appear here as they come in from various sources
          </p>
        </div>
      )}

      {/* Legend */}
      {data.sources.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <p className="text-xs text-gray-500 font-inter">
            Lead sources are tracked automatically from contact forms, guide
            downloads, exit intent popups, and other conversion points.
          </p>
        </div>
      )}
    </div>
  );
}
