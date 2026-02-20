export default function BlogUnsubscribeSkeleton() {
  return (
    <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-8 lg:p-12 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-700/50 animate-pulse">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gray-700 rounded"></div>
        <div className="h-8 bg-gray-700 rounded w-64"></div>
      </div>
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-8"></div>
      <div className="space-y-6">
        <div>
          <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
          <div className="h-12 bg-gray-700 rounded"></div>
        </div>
        <div className="h-12 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  );
}
