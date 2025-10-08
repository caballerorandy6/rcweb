export default function PaymentCompleteSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-24 lg:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-lg w-full bg-gray-800 rounded-2xl p-8 text-center relative z-10 border border-gold/20 animate-pulse">
        {/* Success Icon Skeleton */}
        <div className="mb-6 flex justify-center">
          <div className="h-20 w-20 bg-gray-700 rounded-full"></div>
        </div>

        {/* Title Skeleton */}
        <div className="h-10 bg-gray-700 rounded-lg mb-2 mx-auto w-3/4"></div>

        {/* Subtitle Skeleton */}
        <div className="h-7 bg-gray-700 rounded-lg mb-6 mx-auto w-1/2"></div>

        {/* Content Box Skeleton */}
        <div className="bg-gray-700/50 rounded-lg p-6 mb-6">
          <div className="h-6 bg-gray-600 rounded mb-4 mx-auto w-1/3"></div>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-5 h-5 bg-gray-600 rounded mr-2 mt-0.5 flex-shrink-0"></div>
              <div className="flex-1 h-4 bg-gray-600 rounded"></div>
            </div>
            <div className="flex items-start">
              <div className="w-5 h-5 bg-gray-600 rounded mr-2 mt-0.5 flex-shrink-0"></div>
              <div className="flex-1 h-4 bg-gray-600 rounded"></div>
            </div>
            <div className="flex items-start">
              <div className="w-5 h-5 bg-gray-600 rounded mr-2 mt-0.5 flex-shrink-0"></div>
              <div className="flex-1 h-4 bg-gray-600 rounded"></div>
            </div>
            <div className="flex items-start">
              <div className="w-5 h-5 bg-gray-600 rounded mr-2 mt-0.5 flex-shrink-0"></div>
              <div className="flex-1 h-4 bg-gray-600 rounded"></div>
            </div>
          </div>
        </div>

        {/* Project Code Skeleton */}
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <div className="h-4 bg-gray-600 rounded mb-2 mx-auto w-1/3"></div>
          <div className="h-8 bg-gray-600 rounded mx-auto w-1/2"></div>
          <div className="h-3 bg-gray-600 rounded mt-2 mx-auto w-1/4"></div>
        </div>

        {/* Buttons Skeleton */}
        <div className="space-y-3">
          <div className="h-12 bg-gray-700 rounded-lg"></div>
          <div className="h-12 bg-gray-700 rounded-lg"></div>
        </div>

        {/* Footer Skeleton */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="h-4 bg-gray-700 rounded mx-auto w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded mx-auto w-1/2"></div>
        </div>
      </div>
    </div>
  );
}
