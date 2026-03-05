import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

export default function RevenueAttributionSkeleton() {
  return (
    <div className="bg-gray-800/80 rounded-xl p-4 sm:p-6 border border-gray-700/50 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-5">
        <div className="flex items-center gap-3">
          <CurrencyDollarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gold/50 flex-shrink-0" />
          <div className="h-7 w-44 bg-gray-700 rounded" />
        </div>
        <div className="sm:ml-auto">
          <div className="h-6 w-24 bg-gray-700 rounded" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* By Lead Source Skeleton */}
        <div>
          <div className="h-4 w-28 bg-gray-700 rounded mb-3" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <div className="h-4 w-24 bg-gray-700 rounded" />
                  <div className="h-4 w-16 bg-gray-700 rounded" />
                </div>
                <div className="h-2 bg-gray-700 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* By UTM Source Skeleton */}
        <div>
          <div className="h-4 w-32 bg-gray-700 rounded mb-3" />
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="p-2.5 bg-gray-700/30 rounded-lg">
                <div className="flex justify-between">
                  <div>
                    <div className="h-4 w-20 bg-gray-700 rounded mb-1" />
                    <div className="h-3 w-16 bg-gray-700 rounded" />
                  </div>
                  <div className="h-5 w-16 bg-gray-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
