export default function ClientDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900 pt-24 sm:pt-32 pb-8 px-4">
      <div className="max-w-7xl mx-auto animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="h-12 bg-gray-800 rounded-lg w-80 mb-4"></div>
            <div className="h-5 bg-gray-800 rounded w-96"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 bg-gray-800 rounded w-32"></div>
            <div className="h-10 bg-gray-800 rounded w-24"></div>
          </div>
        </div>

        {/* Statistics Summary Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-6 rounded-xl border border-gray-700/50"
            >
              <div className="h-4 bg-gray-700 rounded w-24 mb-3"></div>
              <div className="h-10 bg-gray-700 rounded w-16"></div>
            </div>
          ))}
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects List Skeleton */}
          <div className="lg:col-span-1">
            <div className="h-8 bg-gray-800 rounded w-40 mb-6"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-gray-700/60 bg-gray-800/80"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="h-5 bg-gray-700 rounded w-32 mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded w-24"></div>
                    </div>
                    <div className="h-6 bg-gray-700 rounded w-20"></div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="h-3 bg-gray-700 rounded w-24"></div>
                      <div className="h-3 bg-gray-700 rounded w-12"></div>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2">
                      <div className="bg-gray-700 h-2 rounded-full w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Details Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-6 lg:p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-700/50">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="h-10 bg-gray-700 rounded w-64 mb-2"></div>
                  <div className="h-5 bg-gray-700 rounded w-48"></div>
                </div>
                <div className="h-7 bg-gray-700 rounded w-24"></div>
              </div>

              {/* Payment Information Skeleton */}
              <div className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="h-7 bg-gray-700 rounded w-48 mb-4"></div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                    <div className="h-6 bg-gray-700 rounded w-32"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-gray-700 rounded w-28 mb-2"></div>
                    <div className="h-6 bg-gray-700 rounded w-32 mb-1"></div>
                    <div className="h-4 bg-gray-700 rounded w-40"></div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
                  <div className="h-6 bg-gray-700 rounded w-32 mb-1"></div>
                  <div className="h-4 bg-gray-700 rounded w-40"></div>
                </div>
              </div>

              {/* Milestones Skeleton */}
              <div className="mb-6">
                <div className="h-7 bg-gray-700 rounded w-48 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="h-5 bg-gray-700 rounded w-48"></div>
                        <div className="h-6 bg-gray-700 rounded w-20"></div>
                      </div>
                      <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-700 rounded w-40"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Button Skeleton */}
              <div className="mt-6">
                <div className="h-12 bg-gray-700 rounded-xl w-64"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
