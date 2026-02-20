export default function TermsOfServiceSkeleton() {
  return (
    <section className="relative isolate overflow-hidden pt-24 sm:pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mx-auto max-w-2xl text-center mb-16 animate-pulse">
          <div className="mb-4 flex justify-center">
            <div className="h-12 w-12 bg-gray-700 rounded-lg"></div>
          </div>
          <div className="h-12 bg-gray-700 rounded-lg mb-4 mx-auto w-3/4"></div>
          <div className="h-6 bg-gray-700 rounded-lg mx-auto w-full"></div>
        </div>

        {/* Last Updated Skeleton */}
        <div className="mx-auto max-w-4xl mb-8 animate-pulse">
          <div className="rounded-xl border border-gold/20 bg-gray-900/50 p-4">
            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>

        {/* Content Cards Skeleton */}
        <div className="mx-auto max-w-4xl space-y-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-gold/20 bg-gray-900/50 backdrop-blur-sm p-6"
            >
              {/* Card Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="h-8 w-8 bg-gray-700 rounded-lg flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-7 bg-gray-700 rounded-lg mb-2 w-1/2"></div>
                  <div className="h-4 bg-gray-700 rounded-lg w-full"></div>
                  <div className="h-4 bg-gray-700 rounded-lg w-3/4 mt-2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons Skeleton */}
        <div className="mx-auto max-w-4xl mt-12 flex flex-col sm:flex-row gap-4 justify-center animate-pulse">
          <div className="h-12 bg-gray-700 rounded-lg w-full sm:w-48"></div>
          <div className="h-12 bg-gray-700 rounded-lg w-full sm:w-48"></div>
        </div>
      </div>
    </section>
  );
}
