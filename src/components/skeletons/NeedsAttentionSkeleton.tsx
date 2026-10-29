import { BellAlertIcon } from "@heroicons/react/24/outline";

export default function NeedsAttentionSkeleton() {
  return (
    <div className="bg-gray-800/80 rounded-xl p-4 sm:p-6 border border-gray-700/50 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <BellAlertIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 shrink-0" />
        <div className="h-6 sm:h-7 w-40 bg-gray-700 rounded-sm" />
        <div className="ml-auto h-3 w-24 bg-gray-700/60 rounded-sm" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg bg-gray-700/30 border border-gray-700/50 p-3 sm:p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-700 rounded-sm" />
              <div className="h-4 w-32 bg-gray-700 rounded-sm" />
              <div className="ml-auto h-5 w-7 bg-gray-700 rounded-full" />
            </div>
            <div className="h-4 w-3/4 bg-gray-700/60 rounded-sm" />
            <div className="h-4 w-2/3 bg-gray-700/60 rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
