import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <CheckCircleIcon className="mx-auto h-20 w-20 text-green-400" />
        </div>

        <h1 className="text-4xl font-bold text-gold mb-4 font-iceland">
          Payment Successful!
        </h1>

        <p className="text-white/80 mb-8 font-inter">
          Thank you for your purchase. We&#39;ve received your payment and will
          contact you within 24 hours to start your project.
        </p>

        <div className="bg-gray-800/50 rounded-lg p-6 mb-8 text-left">
          <h2 className="text-lg font-semibold text-white mb-3 font-inter">
            What&#39;s Next?
          </h2>
          <ul className="space-y-2 text-sm text-gray-300 font-inter">
            <li className="flex items-start">
              <span className="text-gold mr-2">1.</span>
              You&#39;ll receive a confirmation email shortly
            </li>
            <li className="flex items-start">
              <span className="text-gold mr-2">2.</span>
              Our team will schedule a kickoff meeting
            </li>
            <li className="flex items-start">
              <span className="text-gold mr-2">3.</span>
              We&#39;ll begin working on your project immediately
            </li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Link
            href="/"
            className="flex-1 bg-gold text-gray-900 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors text-center font-inter"
          >
            Back to Home
          </Link>
          <Link
            href="/#contact"
            className="flex-1 border border-gold/50 text-gold py-3 rounded-lg hover:bg-gold/10 transition-colors text-center font-inter"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
