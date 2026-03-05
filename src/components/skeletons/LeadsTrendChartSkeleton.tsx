import { ChartBarIcon } from "@heroicons/react/24/outline";

export default function LeadsTrendChartSkeleton() {
  return (
    <div className="bg-gray-800/80 rounded-xl p-4 sm:p-6 border border-gray-700/50 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 flex-shrink-0" />
          <div className="h-7 w-32 bg-gray-700 rounded" />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-20 bg-gray-700 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-700/30 rounded-lg p-3 text-center">
            <div className="h-3 w-16 bg-gray-700 rounded mx-auto mb-2" />
            <div className="h-8 w-12 bg-gray-700 rounded mx-auto" />
          </div>
        ))}
      </div>

      {/* Chart placeholder */}
      <div className="h-64 sm:h-80 bg-gray-700/30 rounded-lg flex items-center justify-center">
        <div className="text-gray-600">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm">Loading chart...</p>
        </div>
      </div>
    </div>
  );
}
