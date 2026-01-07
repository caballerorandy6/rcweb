export default function ClientInvoicesSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900 pt-24 sm:pt-32 pb-8 px-4">
      <div className="max-w-7xl mx-auto animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-12 bg-gray-800 rounded-lg w-64 mb-4"></div>
          <div className="h-5 bg-gray-800 rounded w-96"></div>
        </div>

        {/* Filters Skeleton */}
        <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-6 rounded-2xl border border-gray-700/50 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-10 bg-gray-800 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Invoices List Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-6 rounded-xl border border-gray-700/50"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-6 bg-gray-700 rounded w-32"></div>
                    <div className="h-6 bg-gray-700 rounded w-20"></div>
                    <div className="h-6 bg-gray-700 rounded w-24"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-48"></div>
                    <div className="h-4 bg-gray-700 rounded w-40"></div>
                    <div className="h-8 bg-gray-700 rounded w-32 mt-2"></div>
                  </div>
                </div>
                <div className="h-12 bg-gray-700 rounded-lg w-40"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

