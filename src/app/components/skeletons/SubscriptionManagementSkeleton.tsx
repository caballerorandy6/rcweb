export default function SubscriptionManagementSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
            <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-700 rounded w-16"></div>
          </div>
        ))}
      </div>

      {/* Filter Skeleton */}
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-700 rounded-lg w-20"></div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-4">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-700/50 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
