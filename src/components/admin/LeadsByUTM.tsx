import { getLeadsByUTMAction } from "@/actions/stats/getLeadsByUTMAction";
import {
  GlobeAltIcon,
  MegaphoneIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

// Colors for UTM sources
const sourceColors: Record<string, string> = {
  google: "#4285F4",
  facebook: "#1877F2",
  instagram: "#E4405F",
  linkedin: "#0A66C2",
  twitter: "#1DA1F2",
  x: "#000000",
  tiktok: "#000000",
  email: "#EA4335",
  newsletter: "#34A853",
  direct: "#6B7280",
  organic: "#22C55E",
  referral: "#8B5CF6",
  Unknown: "#9CA3AF",
};

export default async function LeadsByUTM() {
  const data = await getLeadsByUTMAction();

  const hasData = data.bySources.length > 0 || data.byCampaigns.length > 0;

  return (
    <div className="bg-gray-800/80 rounded-xl p-4 sm:p-6 border border-gray-700/50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-5">
        <div className="flex items-center gap-3">
          <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gold flex-shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold text-white font-iceland">
            UTM Tracking
          </h2>
        </div>
        <div className="sm:ml-auto flex gap-3 text-sm font-inter">
          <span className="text-gray-400">
            With UTM: <span className="text-green-400 font-semibold">{data.totalWithUTM}</span>
          </span>
          <span className="text-gray-400">
            Direct: <span className="text-gray-300 font-semibold">{data.totalWithoutUTM}</span>
          </span>
        </div>
      </div>

      {hasData ? (
        <div className="grid md:grid-cols-2 gap-6">
          {/* By Source */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <GlobeAltIcon className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-300 font-inter">By Source</h3>
            </div>
            <div className="space-y-2.5">
              {data.bySources.map((source) => {
                const color = sourceColors[source.utmSource.toLowerCase()] || sourceColors.Unknown;
                return (
                  <div key={source.utmSource} className="font-inter">
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <span className="text-xs sm:text-sm text-gray-300 truncate capitalize">
                        {source.utmSource}
                      </span>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-xs sm:text-sm font-semibold text-white">
                          {source.count}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-500">
                          ({source.percentage}%)
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
              {data.bySources.length === 0 && (
                <p className="text-sm text-gray-500 font-inter">No UTM sources recorded yet</p>
              )}
            </div>
          </div>

          {/* By Campaign */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MegaphoneIcon className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-300 font-inter">Top Campaigns</h3>
            </div>
            <div className="space-y-2">
              {data.byCampaigns.map((campaign, idx) => (
                <div
                  key={`${campaign.utmCampaign}-${idx}`}
                  className="flex items-center justify-between p-2.5 bg-gray-700/30 rounded-lg font-inter"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white truncate">{campaign.utmCampaign}</p>
                    {campaign.utmSource && (
                      <p className="text-xs text-gray-500 capitalize">{campaign.utmSource}</p>
                    )}
                  </div>
                  <span className="text-sm font-bold text-gold ml-2">{campaign.count}</span>
                </div>
              ))}
              {data.byCampaigns.length === 0 && (
                <p className="text-sm text-gray-500 font-inter">No campaigns recorded yet</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <LinkIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-inter text-sm sm:text-base">No UTM data recorded yet</p>
          <p className="text-xs sm:text-sm text-gray-500 font-inter mt-1">
            UTM parameters will appear here when leads arrive from tracked campaigns
          </p>
        </div>
      )}

      {/* Legend */}
      {hasData && (
        <div className="mt-5 pt-4 border-t border-gray-700/50">
          <p className="text-[10px] sm:text-xs text-gray-500 font-inter">
            UTM parameters are captured automatically from campaign URLs (e.g., ?utm_source=google&utm_campaign=spring_sale)
          </p>
        </div>
      )}
    </div>
  );
}
