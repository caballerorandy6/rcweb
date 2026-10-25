"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import {
  CheckCircleIcon,
  CalendarIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import confetti from "canvas-confetti";
import type { Subscription } from "@/generated/prisma/client";
import { trackLeadConversion, trackPurchase } from "@/lib/analytics";
import { formatCurrency, formatDate as formatDateUtil } from "@/lib/utils";
import { trackFBPurchase } from "@/components/tracking/FacebookPixel";
import { trackLinkedInConversion } from "@/lib/linkedin";

interface SubscriptionSuccessProps {
  subscription?: Subscription | null;
  error?: string;
}

export default function SubscriptionSuccess({
  subscription,
  error,
}: SubscriptionSuccessProps) {
  useEffect(() => {
    if (subscription && !error) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      trackPurchase(
        subscription.amount / 100,
        subscription.currency,
        subscription.stripeSubscriptionId
      );

      // Track Facebook Pixel Purchase
      trackFBPurchase(subscription.amount / 100, subscription.currency);

      // Track LinkedIn Conversion
      trackLinkedInConversion();

      trackLeadConversion();
    }
  }, [subscription, error]);

  const formatDate = (date: Date | null) => {
    if (!date) return "In approximately 30 days";
    return formatDateUtil(date, { month: "long" });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-24 sm:py-32">
        <div
          className="max-w-md w-full bg-red-900/20 border border-red-500/50 rounded-2xl p-8 text-center animate-enter"
        >
          <div className="text-red-500 mb-4">
            <ExclamationTriangleIcon className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Subscription Processing Issue
          </h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <p className="text-sm text-gray-400 mb-6">
            Don&apos;t worry! If your payment was successful in Stripe, I&apos;ll
            process it shortly. Please check your email for confirmation.
          </p>
          <Button href="mailto:contactus@rcweb.dev">Contact Support</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 to-black flex items-center justify-center px-4 py-24 sm:py-32">
      <div className="max-w-2xl w-full animate-enter">
        {/* Success Icon */}
        <div className="text-center mb-8 animate-enter [animation-delay:200ms]">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/20 rounded-full mb-4">
            <CheckCircleIcon className="w-16 h-16 text-green-500" />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800/50 backdrop-blur-xs rounded-2xl p-8 border border-gold/20">
          <h1 className="text-4xl font-bold text-gold text-center mb-4">
            Subscription Active!
          </h1>

          <p className="text-gray-300 text-center mb-8 font-inter">
            Thank you for subscribing to the maintenance plan. Your website is
            now protected and supported.
          </p>

          {/* Subscription Details */}
          {subscription && (
            <div className="space-y-4 mb-8 animate-enter [animation-delay:300ms]">
              {/* Plan Info */}
              <div className="bg-linear-to-r from-gold/20 to-yellow-500/20 rounded-xl p-6 border border-gold/30">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCardIcon className="w-6 h-6 text-gold" />
                  <span className="text-lg font-semibold text-gold">
                    {subscription.planName}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Monthly Amount:</span>
                    <p className="text-white font-semibold text-lg">
                      {formatCurrency(subscription.amount)}/mo
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <p className="text-green-500 font-semibold capitalize">
                      {subscription.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Billing Info */}
              <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-gray-400 text-sm">Next Billing Date:</span>
                    <p className="text-white font-medium">
                      {formatDate(subscription.currentPeriodEnd)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <p className="text-white">{subscription.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Subscription ID:</span>
                    <p className="text-gray-300 font-mono text-xs truncate">
                      {subscription.stripeSubscriptionId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* What's Included */}
          <div className="bg-blue-900/20 rounded-lg p-4 mb-8 border border-blue-500/30 font-inter">
            <h3 className="text-blue-400 font-semibold mb-3">
              What&apos;s Included in Your Plan
            </h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                Security patches & updates
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                Performance monitoring
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                Content updates (up to 4 hours/month)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                Technical support via email
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                Monthly reports
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 font-inter">
            <Button href="/" className="flex-1">
              Return to Home
            </Button>
            <Button href="mailto:contactus@rcweb.dev" variant="secondary" className="flex-1">
              Contact Support
            </Button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-400 text-sm mt-6 font-inter mx-auto">
          You&apos;ll receive a confirmation email shortly with all the details.
        </p>
      </div>
    </div>
  );
}
