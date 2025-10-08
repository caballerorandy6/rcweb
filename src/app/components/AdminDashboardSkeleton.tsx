export default function AdminDashboardSkeleton() {
  return (
    <div className="pt-24 lg:pt-32 animate-pulse">
      {/* Header Skeleton */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-50 rounded-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-48 bg-gray-800 rounded"></div>
              <span className="text-gray-400">|</span>
              <div className="h-6 w-32 bg-gray-800 rounded"></div>
            </div>
            <div className="h-10 w-24 bg-gray-800 rounded"></div>
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50"
            >
              <div className="h-4 w-24 bg-gray-700 rounded mb-3"></div>
              <div className="h-8 w-16 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 bg-gray-700 rounded"></div>
                <div className="h-6 w-32 bg-gray-700 rounded"></div>
              </div>
              <div className="h-4 w-full bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>

        {/* User Info Skeleton */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
          <div className="h-7 w-48 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex justify-between py-2 border-b border-gray-700/50"
              >
                <div className="h-5 w-24 bg-gray-700 rounded"></div>
                <div className="h-5 w-32 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
