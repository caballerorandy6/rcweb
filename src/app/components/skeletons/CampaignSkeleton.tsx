export default function CampaignSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900 pb-8 px-8 pt-24 sm:pt-32">
      <div className="max-w-4xl mx-auto animate-pulse">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-10 bg-gray-800/50 rounded-lg w-64 mb-4"></div>

          {/* Stats card skeleton */}
          <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
            <div className="h-5 bg-gray-700/50 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-700/30 rounded w-full"></div>
          </div>
        </div>

        {/* Form skeleton */}
        <div className="space-y-6">
          {/* Subject/First input */}
          <div>
            <div className="h-4 bg-gray-700/50 rounded w-28 mb-2"></div>
            <div className="h-12 bg-gray-800 rounded-lg border border-gray-700"></div>
          </div>

          {/* Second input (Image upload or templates) */}
          <div>
            <div className="h-4 bg-gray-700/50 rounded w-32 mb-2"></div>
            <div className="h-12 bg-gray-800 rounded-lg border border-gray-700"></div>
          </div>

          {/* Content/Message textarea */}
          <div>
            <div className="h-4 bg-gray-700/50 rounded w-36 mb-2"></div>
            <div className="h-48 bg-gray-800 rounded-lg border border-gray-700"></div>
          </div>

          {/* Test mode toggle */}
          <div className="flex items-center space-x-3">
            <div className="h-5 w-5 bg-gray-800 rounded border border-gray-700"></div>
            <div className="h-4 bg-gray-700/50 rounded w-40"></div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px] h-12 bg-gray-700/50 rounded-lg"></div>
            <div className="h-12 w-40 bg-gray-700/30 rounded-lg"></div>
            <div className="h-12 w-40 bg-gray-700/30 rounded-lg"></div>
          </div>
        </div>

        {/* Campaign History / Info cards skeleton */}
        <div className="mt-8">
          <div className="h-12 bg-gray-800/50 rounded-lg mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800/30 rounded-lg">
              <div className="h-5 bg-gray-700/50 rounded w-32 mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-700/30 rounded w-full"></div>
                <div className="h-3 bg-gray-700/30 rounded w-5/6"></div>
                <div className="h-3 bg-gray-700/30 rounded w-4/6"></div>
              </div>
            </div>
            <div className="p-4 bg-gray-800/30 rounded-lg">
              <div className="h-5 bg-gray-700/50 rounded w-32 mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-700/30 rounded w-full"></div>
                <div className="h-3 bg-gray-700/30 rounded w-5/6"></div>
                <div className="h-3 bg-gray-700/30 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips section skeleton */}
        <div className="mt-8 p-4 bg-gray-800/30 rounded-lg">
          <div className="h-5 bg-gray-700/50 rounded w-24 mb-3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-700/30 rounded w-full"></div>
            <div className="h-3 bg-gray-700/30 rounded w-5/6"></div>
            <div className="h-3 bg-gray-700/30 rounded w-4/6"></div>
            <div className="h-3 bg-gray-700/30 rounded w-3/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
