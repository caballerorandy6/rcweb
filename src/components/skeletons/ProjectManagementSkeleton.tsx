export default function ProjectManagementSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 animate-pulse">
      <div>
        <div className="h-10 w-40 bg-gray-800 rounded-sm mb-3" />
        <div className="h-5 w-96 max-w-full bg-gray-800 rounded-sm" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-800/80 border border-gray-700/50 rounded-xl p-4 sm:p-6">
            <div className="h-4 w-24 bg-gray-700 rounded-sm mb-3" />
            <div className="h-8 w-16 bg-gray-700 rounded-sm" />
          </div>
        ))}
      </div>

      <div className="bg-gray-800/80 border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="h-12 bg-gray-700/50" />
        <div className="divide-y divide-gray-700/30">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-6 px-6 py-4">
              <div className="h-5 w-20 bg-gray-700 rounded-sm" />
              <div className="h-5 w-40 bg-gray-700 rounded-sm" />
              <div className="h-5 w-24 bg-gray-700 rounded-sm hidden md:block" />
              <div className="h-5 w-32 bg-gray-700 rounded-sm" />
              <div className="h-5 w-20 bg-gray-700 rounded-sm hidden sm:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
