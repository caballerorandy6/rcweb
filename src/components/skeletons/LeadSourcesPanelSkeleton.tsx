/** Placeholder for one tab of the Lead sources card while its data streams in */
export default function LeadSourcesPanelSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="h-4 sm:h-5 w-28 bg-gray-700 rounded-sm mb-4" />
      <div className="space-y-3">
        {[80, 60, 45, 30].map((width) => (
          <div key={width}>
            <div className="flex items-center justify-between mb-1 gap-2">
              <div className="h-3 sm:h-4 w-24 bg-gray-700 rounded-sm" />
              <div className="h-3 sm:h-4 w-12 bg-gray-700 rounded-sm" />
            </div>
            <div className="h-2 sm:h-2.5 bg-gray-700/50 rounded-full overflow-hidden">
              <div className="h-full bg-gray-600 rounded-full" style={{ width: `${width}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
