import { StarIcon } from "@heroicons/react/24/outline";

export default function GoogleReviewsSkeleton() {
  return (
    <div className="bg-gray-800/80 rounded-xl p-4 sm:p-6 border border-gray-700/50 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-5">
        <div className="flex items-center gap-3">
          <StarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 shrink-0" />
          <div className="h-6 sm:h-7 w-36 sm:w-44 bg-gray-700 rounded-sm" />
        </div>
        <div className="sm:ml-auto h-7 w-24 bg-gray-700 rounded-lg" />
      </div>
      <div className="h-3 w-72 max-w-full bg-gray-700/60 rounded-sm mb-3" />
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-700/30 rounded-lg" />
        ))}
      </div>
      <div className="divide-y divide-gray-700/50 border-t border-gray-700/50">
        {[1, 2, 3].map((i) => (
          <div key={i} className="py-3 space-y-2">
            <div className="h-4 w-48 bg-gray-700 rounded-sm" />
            <div className="h-3 w-full bg-gray-700/40 rounded-sm" />
            <div className="h-3 w-2/3 bg-gray-700/40 rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
