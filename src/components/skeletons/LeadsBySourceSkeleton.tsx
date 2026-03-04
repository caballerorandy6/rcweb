import { ChartBarIcon } from "@heroicons/react/24/outline";

export default function LeadsBySourceSkeleton() {
  return (
    <div className="bg-gray-800/80 rounded-xl p-4 sm:p-6 border border-gray-700/50 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-5">
        <div className="flex items-center gap-3">
          <ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 flex-shrink-0" />
          <div className="h-6 sm:h-7 w-32 sm:w-40 bg-gray-700 rounded" />
        </div>
        <div className="sm:ml-auto h-4 sm:h-5 w-24 bg-gray-700 rounded" />
      </div>

      {/* Status Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-14 sm:h-16 bg-gray-700/30 rounded-lg"
          />
        ))}
      </div>

      {/* Source Bars */}
      <div className="space-y-3 sm:space-y-4">
        {[80, 60, 45].map((width, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1.5 gap-2">
              <div className="h-3 sm:h-4 w-20 sm:w-28 bg-gray-700 rounded" />
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="h-3 sm:h-4 w-8 bg-gray-700 rounded" />
                <div className="h-2.5 sm:h-3 w-8 bg-gray-700/50 rounded" />
              </div>
            </div>
            <div className="h-2.5 sm:h-3 bg-gray-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-600 rounded-full"
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
