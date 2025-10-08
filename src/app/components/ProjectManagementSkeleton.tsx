export default function ProjectManagementSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900 p-8 py-24 lg:py-32 animate-pulse">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="h-10 w-64 bg-gray-800 rounded mb-8"></div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-800 p-4 rounded-lg">
              <div className="h-4 w-24 bg-gray-700 rounded mb-2"></div>
              <div className="h-8 w-16 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-3">
                    <div className="h-4 w-12 bg-gray-600 rounded"></div>
                  </th>
                  <th className="px-6 py-3">
                    <div className="h-4 w-16 bg-gray-600 rounded"></div>
                  </th>
                  <th className="px-6 py-3">
                    <div className="h-4 w-12 bg-gray-600 rounded"></div>
                  </th>
                  <th className="px-6 py-3">
                    <div className="h-4 w-16 bg-gray-600 rounded"></div>
                  </th>
                  <th className="px-6 py-3">
                    <div className="h-4 w-20 bg-gray-600 rounded"></div>
                  </th>
                  <th className="px-6 py-3">
                    <div className="h-4 w-16 bg-gray-600 rounded"></div>
                  </th>
                  <th className="px-6 py-3">
                    <div className="h-4 w-16 bg-gray-600 rounded"></div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="h-5 w-20 bg-gray-700 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 w-32 bg-gray-700 rounded mb-2"></div>
                      <div className="h-4 w-40 bg-gray-700 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 w-24 bg-gray-700 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 w-20 bg-gray-700 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <div className="h-6 w-16 bg-gray-700 rounded"></div>
                        <div className="h-6 w-16 bg-gray-700 rounded"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 w-24 bg-gray-700 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-8 w-32 bg-gray-700 rounded"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
