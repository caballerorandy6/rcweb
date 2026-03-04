export default function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 font-inter">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-800/80 rounded-xl p-4 sm:p-5 border border-gray-700/50 animate-pulse"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="h-3 sm:h-4 bg-gray-700/50 rounded w-16 sm:w-20 mb-2"></div>
              <div className="h-6 sm:h-8 bg-gray-700/50 rounded w-12 sm:w-16 mt-1"></div>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-700/50 rounded flex-shrink-0"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
