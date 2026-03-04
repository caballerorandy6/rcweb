import { ChartBarIcon } from "@heroicons/react/24/outline";

export default function LeadsBySourceSkeleton() {
  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <ChartBarIcon className="w-6 h-6 text-gray-600" />
        <div className="h-7 w-40 bg-gray-700 rounded" />
        <div className="ml-auto h-5 w-24 bg-gray-700 rounded" />
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-8 w-28 bg-gray-700/50 rounded-full"
          />
        ))}
      </div>

      {/* Source Bars */}
      <div className="space-y-4">
        {[80, 60, 45, 30, 15].map((width, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <div className="h-4 w-24 bg-gray-700 rounded" />
              <div className="flex items-center gap-2">
                <div className="h-4 w-8 bg-gray-700 rounded" />
                <div className="h-3 w-10 bg-gray-700/50 rounded" />
              </div>
            </div>
            <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden">
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
