export default function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8 font-inter">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {/* Label skeleton */}
              <div className="h-4 bg-gray-700/50 rounded w-24 mb-2"></div>
              {/* Value skeleton */}
              <div className="h-8 bg-gray-700/50 rounded w-16 mt-1"></div>
            </div>
            {/* Icon skeleton */}
            <div className="w-8 h-8 bg-gray-700/50 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
