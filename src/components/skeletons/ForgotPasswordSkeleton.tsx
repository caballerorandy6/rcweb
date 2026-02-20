export default function ForgotPasswordSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-purple-500/5 rounded-2xl blur-xl"></div>

          <div className="relative space-y-6 bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-700/50 animate-pulse">
            <div className="absolute top-0 left-0 w-20 h-20 bg-gold/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full blur-2xl"></div>

            <div className="relative">
              {/* Title Skeleton */}
              <div className="h-12 bg-gray-700 rounded-lg mb-4 mx-auto w-3/4"></div>
              {/* Divider Skeleton */}
              <div className="h-1 bg-gray-700 rounded-full mx-auto w-24 mb-4"></div>
              {/* Subtitle Skeleton */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded mx-auto w-full"></div>
                <div className="h-4 bg-gray-700 rounded mx-auto w-5/6"></div>
              </div>
            </div>

            {/* Form Skeleton */}
            <div className="space-y-6">
              {/* Email Field Skeleton */}
              <div>
                <div className="h-12 bg-gray-700 rounded-xl"></div>
              </div>

              {/* Submit Button Skeleton */}
              <div className="pt-2">
                <div className="h-14 bg-gray-700 rounded-xl"></div>
              </div>
            </div>

            {/* Footer Skeleton */}
            <div className="text-center">
              <div className="h-4 bg-gray-700 rounded mx-auto w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

