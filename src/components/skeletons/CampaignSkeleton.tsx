export default function CampaignSkeleton() {
  return (
    <div className="max-w-4xl space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 animate-pulse">
      <div>
        <div className="h-10 w-64 bg-gray-800 rounded-sm mb-3" />
        <div className="h-5 w-80 max-w-full bg-gray-800 rounded-sm" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-gray-800/80 border border-gray-700/50 rounded-xl p-4 sm:p-6">
            <div className="h-4 w-24 bg-gray-700 rounded-sm mb-3" />
            <div className="h-8 w-16 bg-gray-700 rounded-sm" />
          </div>
        ))}
      </div>

      <div className="bg-gray-800/80 border border-gray-700/50 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="h-6 w-40 bg-gray-700 rounded-sm" />
        <div className="h-10 w-full bg-gray-700 rounded-lg" />
        <div className="h-32 w-full bg-gray-700 rounded-lg" />
        <div className="h-10 w-32 bg-gray-700 rounded-lg" />
      </div>
    </div>
  );
}
