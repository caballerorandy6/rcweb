import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  getSearchPerformanceAction,
  type SearchPeriodTotals,
  type SearchTopItem,
} from "@/actions/stats/getSearchPerformanceAction";
import {
  SEARCH_CONSOLE_BACKFILL_DAYS,
  SEARCH_PERFORMANCE_WINDOW,
} from "@/lib/searchConsole/config";
import { formatDate, formatDateTime, formatNumber } from "@/lib/utils";
import SearchPerformanceChart from "@/components/admin/SearchPerformanceChart";
import SyncSearchConsoleButton from "@/components/admin/SyncSearchConsoleButton";

// Search Console devuelve URLs completas; en la tabla basta la ruta. El host
// sin www es el antiguo (hoy redirige a www) y se marca para distinguirlo.
const SITE_ORIGIN = /^https?:\/\/(www\.)?rcweb\.dev/;

function pagePath(url: string): string {
  const match = SITE_ORIGIN.exec(url);
  if (!match) return url;
  const path = url.slice(match[0].length) || "/";
  return match[1] ? path : `${path} (non-www)`;
}

function percent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

/** Cambio relativo frente al periodo anterior, como texto corto; null si no hay base. */
function delta(current: number, previous: number, lowerIsBetter = false): {
  text: string;
  tone: "up" | "down" | "flat";
} | null {
  if (previous === 0) return null;
  const change = (current - previous) / previous;
  if (Math.abs(change) < 0.005) return { text: "±0%", tone: "flat" };
  const improved = lowerIsBetter ? change < 0 : change > 0;
  return {
    text: `${change > 0 ? "+" : ""}${(change * 100).toFixed(0)}%`,
    tone: improved ? "up" : "down",
  };
}

const TONE_CLASSES = {
  up: "text-green-400",
  down: "text-red-400",
  flat: "text-gray-500",
} as const;

function Metric({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: ReturnType<typeof delta>;
}) {
  return (
    <div className="bg-gray-700/30 rounded-lg p-3 text-center">
      <p className="text-xs text-gray-400 font-inter">{label}</p>
      <p className="text-xl sm:text-2xl text-white font-iceland">{value}</p>
      <p className={`text-[11px] font-inter ${change ? TONE_CLASSES[change.tone] : "text-gray-600"}`}>
        {change ? `${change.text} vs prev.` : "no prior data"}
      </p>
    </div>
  );
}

function TopTable({
  title,
  keyHeader,
  items,
  renderKey,
}: {
  title: string;
  keyHeader: string;
  items: SearchTopItem[];
  renderKey: (key: string) => React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <h4 className="text-sm font-semibold text-gray-300 font-inter mb-2">{title}</h4>
      {items.length === 0 ? (
        <p className="text-xs text-gray-500 font-inter">Nothing recorded in this period.</p>
      ) : (
        <table className="w-full text-xs sm:text-sm font-inter">
          <thead>
            <tr className="text-[10px] sm:text-xs uppercase tracking-wide text-gray-500">
              <th scope="col" className="text-left font-medium pb-1.5">
                {keyHeader}
              </th>
              <th scope="col" className="text-right font-medium pb-1.5 pl-2">
                Clicks
              </th>
              <th scope="col" className="text-right font-medium pb-1.5 pl-2">
                Impr.
              </th>
              <th scope="col" className="text-right font-medium pb-1.5 pl-2 hidden sm:table-cell">
                Pos.
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {items.map((item) => (
              <tr key={item.key}>
                <td className="py-1.5 text-gray-200 max-w-0 w-full truncate" title={item.key}>
                  {renderKey(item.key)}
                </td>
                <td className="py-1.5 pl-2 text-right text-white font-semibold tabular-nums">
                  {formatNumber(item.clicks)}
                </td>
                <td className="py-1.5 pl-2 text-right text-gray-400 tabular-nums">
                  {formatNumber(item.impressions)}
                </td>
                <td className="py-1.5 pl-2 text-right text-gray-400 tabular-nums hidden sm:table-cell">
                  {item.position.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Las fechas de Search Console son días (medianoche UTC): se formatean en UTC
// para que el servidor no las mueva un día.
const DAY_FORMAT = { month: "short", day: "numeric", timeZone: "UTC" } as const;

function periodLabel(period: SearchPeriodTotals): string {
  return `${formatDate(period.startDate, DAY_FORMAT)} – ${formatDate(period.endDate, DAY_FORMAT)}`;
}

export default async function SearchPerformance() {
  const data = await getSearchPerformanceAction();
  const { current, previous } = data;

  return (
    <div className="bg-gray-800/80 rounded-xl p-4 sm:p-6 border border-gray-700/50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-5">
        <div className="flex items-center gap-3">
          <MagnifyingGlassIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gold shrink-0" />
          <h3 className="text-xl sm:text-2xl text-white font-iceland">Search performance</h3>
        </div>
        <div className="sm:ml-auto flex items-center gap-3">
          <span className="text-xs text-gray-500 font-inter">
            {data.lastSyncedAt
              ? `Synced ${formatDateTime(data.lastSyncedAt)}`
              : "Never synced"}
          </span>
          {data.storedDays < SEARCH_PERFORMANCE_WINDOW * 2 && (
            <SyncSearchConsoleButton
              disabled={!data.configured}
              days={SEARCH_CONSOLE_BACKFILL_DAYS}
              label="Backfill 16 months"
            />
          )}
          <SyncSearchConsoleButton disabled={!data.configured} />
        </div>
      </div>

      {!current ? (
        <div className="text-center py-8">
          <MagnifyingGlassIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-inter text-sm sm:text-base">No Search Console data yet</p>
          <p className="text-xs sm:text-sm text-gray-500 font-inter mt-1">
            {data.configured
              ? "Press Backfill 16 months to load the history, or wait for the daily sync at 10:00 UTC."
              : "Search Console is not configured in this environment (GCP_* variables)."}
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-500 font-inter mb-3">
            Last {SEARCH_PERFORMANCE_WINDOW} days with data ({periodLabel(current)}) vs the{" "}
            {SEARCH_PERFORMANCE_WINDOW} before
            {previous && previous.impressions > 0 ? ` (${periodLabel(previous)})` : ""}. Google
            publishes with a 2-3 day delay.
          </p>

          {/* Totals */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <Metric
              label="Clicks"
              value={formatNumber(current.clicks)}
              change={previous ? delta(current.clicks, previous.clicks) : null}
            />
            <Metric
              label="Impressions"
              value={formatNumber(current.impressions)}
              change={previous ? delta(current.impressions, previous.impressions) : null}
            />
            <Metric
              label="CTR"
              value={percent(current.ctr)}
              change={previous ? delta(current.ctr, previous.ctr) : null}
            />
            <Metric
              label="Avg. position"
              value={current.position.toFixed(1)}
              change={previous ? delta(current.position, previous.position, true) : null}
            />
          </div>

          <SearchPerformanceChart data={data.daily} />

          {/* Top queries and pages */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 pt-5 border-t border-gray-700/50">
            <TopTable
              title="Top queries"
              keyHeader="Query"
              items={data.topQueries}
              renderKey={(key) => key}
            />
            <TopTable
              title="Top pages"
              keyHeader="Page"
              items={data.topPages}
              renderKey={pagePath}
            />
          </div>
        </>
      )}
    </div>
  );
}
