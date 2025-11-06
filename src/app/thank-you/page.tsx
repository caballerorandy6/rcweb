import { genPageMetadata } from "@/utils/genPageMetadata";
import Link from "next/link";
import { CheckCircleIcon, EnvelopeIcon, ClockIcon } from "@heroicons/react/24/outline";

export const metadata = genPageMetadata({
  title: "Thank You - Message Received",
  description:
    "Thank you for contacting RC Web Solutions LLC. We have received your message and will get back to you shortly.",
  pageRoute: "/thank-you",
});

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-8 md:mb-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gold/20 rounded-full blur-2xl animate-pulse"></div>
            <CheckCircleIcon className="w-20 h-20 sm:w-24 sm:h-24 text-gold relative" />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl border border-gray-700/50">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gold text-center mb-4 md:mb-6 font-iceland">
            Thank You!
          </h1>

          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6 sm:mb-8 rounded-full"></div>

          <p className="text-lg sm:text-xl text-gray-300 text-center mb-8 sm:mb-10 font-inter">
            Your message has been successfully received.
          </p>

          {/* What's Next Section */}
          <div className="space-y-6 mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white text-center mb-4 sm:mb-6 font-inter">
              What Happens Next?
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {/* Step 1 */}
              <div className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-5 bg-gray-800/50 rounded-xl border border-gray-700/30 hover:border-gold/30 transition-colors">
                <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                  <EnvelopeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 font-inter">
                    Confirmation Email
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base font-inter">
                    You'll receive a confirmation email shortly with a copy of your message.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-5 bg-gray-800/50 rounded-xl border border-gray-700/30 hover:border-gold/30 transition-colors">
                <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                  <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 font-inter">
                    Quick Response Time
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base font-inter">
                    Our team will review your message and respond within 24-48 hours during business days.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-5 bg-gray-800/50 rounded-xl border border-gray-700/30 hover:border-gold/30 transition-colors">
                <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                  <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1 font-inter">
                    Personalized Consultation
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base font-inter">
                    We'll discuss your project requirements and provide a customized solution for your needs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-900/50 rounded-xl p-5 sm:p-6 mb-6 sm:mb-8 border border-gray-700/30">
            <p className="text-center text-gray-300 mb-3 text-sm sm:text-base font-inter">
              Need immediate assistance?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-sm sm:text-base font-inter">
              <a
                href="tel:+13463757534"
                className="text-gold hover:text-yellow-200 transition-colors flex items-center"
              >
                <span className="mr-2">📱</span>
                +1 (346) 375-7534
              </a>
              <span className="hidden sm:inline text-gray-600">|</span>
              <a
                href="mailto:randy@rcweb.dev"
                className="text-gold hover:text-yellow-200 transition-colors flex items-center"
              >
                <span className="mr-2">✉️</span>
                randy@rcweb.dev
              </a>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-black bg-gradient-to-r from-gold via-yellow-200 to-gold hover:from-yellow-200 hover:via-gold hover:to-yellow-200 rounded-xl transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter group transform hover:scale-105 active:scale-95"
            >
              <span>Back to Home</span>
              <svg
                className="ml-2 w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 sm:mt-8 text-center px-4">
          <p className="text-gray-500 text-xs sm:text-sm font-inter">
            🔒 Your information is secure and will never be shared with third parties
          </p>
        </div>
      </div>
    </div>
  );
}
