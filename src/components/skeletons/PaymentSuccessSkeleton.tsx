export default function PaymentSuccessSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center px-4 py-24 sm:py-32 animate-pulse">
      <div className="max-w-2xl w-full">
        {/* Success Icon Skeleton */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-6"></div>
        </div>

        {/* Main Card Skeleton */}
        <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-700/50 p-8 sm:p-12 shadow-2xl">
          {/* Title Skeleton */}
          <div className="text-center mb-8">
            <div className="h-10 w-64 bg-gray-800 rounded mx-auto mb-4"></div>
            <div className="h-6 w-96 bg-gray-800 rounded mx-auto"></div>
          </div>

          {/* Payment Details Skeleton */}
          <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700/30">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-5 w-32 bg-gray-700 rounded"></div>
                  <div className="h-5 w-40 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Code Skeleton */}
          <div className="bg-gradient-to-r from-gold/10 to-gold/5 rounded-xl p-6 mb-8 border border-gold/20">
            <div className="h-5 w-32 bg-gray-700 rounded mb-3"></div>
            <div className="flex items-center justify-between">
              <div className="h-8 w-48 bg-gray-700 rounded"></div>
              <div className="h-10 w-10 bg-gray-700 rounded"></div>
            </div>
          </div>

          {/* Next Steps Skeleton */}
          <div className="bg-gray-800/30 rounded-xl p-6 mb-8">
            <div className="h-6 w-32 bg-gray-700 rounded mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-6 w-6 bg-gray-700 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-4 w-full bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="h-12 flex-1 bg-gray-700 rounded-lg"></div>
            <div className="h-12 flex-1 bg-gray-700 rounded-lg"></div>
          </div>
        </div>

        {/* Support Text Skeleton */}
        <div className="text-center mt-8">
          <div className="h-4 w-64 bg-gray-800 rounded mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
