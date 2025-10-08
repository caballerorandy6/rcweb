export default function UnsubscribeSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-24 lg:py-32">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl p-8 text-center border border-gold/20 animate-pulse">
        {/* Icon Skeleton */}
        <div className="mb-6 flex justify-center">
          <div className="h-16 w-16 bg-gray-700 rounded-full"></div>
        </div>

        {/* Title Skeleton */}
        <div className="h-8 bg-gray-700 rounded-lg mb-4 mx-auto w-3/4"></div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-8">
          <div className="h-4 bg-gray-700 rounded mx-auto w-full"></div>
          <div className="h-4 bg-gray-700 rounded mx-auto w-5/6"></div>
        </div>

        {/* Email Input Skeleton */}
        <div className="mb-4">
          <div className="h-5 bg-gray-700 rounded mb-2 w-1/4"></div>
          <div className="h-12 bg-gray-700 rounded-lg"></div>
        </div>

        {/* Reason Select Skeleton */}
        <div className="mb-6">
          <div className="h-5 bg-gray-700 rounded mb-2 w-1/3"></div>
          <div className="h-12 bg-gray-700 rounded-lg"></div>
        </div>

        {/* Button Skeleton */}
        <div className="h-12 bg-gray-700 rounded-lg mb-4"></div>

        {/* Footer Text Skeleton */}
        <div className="h-3 bg-gray-700 rounded mx-auto w-2/3"></div>
      </div>
    </div>
  );
}
