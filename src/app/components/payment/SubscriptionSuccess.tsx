"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  CalendarIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import type { Subscription } from "@/generated/prisma/client";
import { trackLeadConversion, trackPurchase } from "@/lib/analytics";

interface SubscriptionSuccessProps {
  subscription?: Subscription | null;
  error?: string;
  fallbackUsed?: boolean;
}

export default function SubscriptionSuccess({
  subscription,
  error,
  fallbackUsed,
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

      trackLeadConversion();

      if (fallbackUsed) {
        toast.warning("Subscription processed with fallback method", {
          description:
            "Your subscription was successful but processed through our backup system.",
        });
      }
    }
  }, [subscription, error, fallbackUsed]);

  const formatDate = (date: Date | null) => {
    if (!date) return "In approximately 30 days";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-red-900/20 border border-red-500/50 rounded-2xl p-8 text-center"
        >
          <div className="text-red-500 mb-4">
            <ExclamationTriangleIcon className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Subscription Processing Issue
          </h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <p className="text-sm text-gray-400 mb-6">
            Don&apos;t worry! If your payment was successful in Stripe, we&apos;ll
            process it shortly. Please check your email for confirmation.
          </p>
          <a
            href="mailto:contactus@rcweb.dev"
            className="inline-block px-6 py-3 bg-gold text-gray-900 rounded-lg hover:bg-gold/90 transition-colors"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center px-4 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="max-w-2xl w-full"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/20 rounded-full mb-4">
            <CheckCircleIcon className="w-16 h-16 text-green-500" />
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gold/20">
          <h1 className="text-4xl font-bold text-gold text-center mb-4">
            Subscription Active!
          </h1>

          <p className="text-gray-300 text-center mb-8 font-inter">
            Thank you for subscribing to our maintenance plan. Your website is
            now protected and supported.
          </p>

          {/* Fallback Warning */}
          {fallbackUsed && (
            <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-yellow-500 font-semibold text-sm">
                    Processing in Progress
                  </p>
                  <p className="text-yellow-200/80 text-xs mt-1">
                    Your subscription is being set up. You&apos;ll receive a
                    confirmation email shortly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Details */}
          {subscription && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4 mb-8"
            >
              {/* Plan Info */}
              <div className="bg-gradient-to-r from-gold/20 to-yellow-500/20 rounded-xl p-6 border border-gold/30">
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
                      ${(subscription.amount / 100).toFixed(2)}/mo
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
            </motion.div>
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
            <Link
              href="/"
              className="flex-1 text-center px-6 py-3 bg-gold text-gray-900 rounded-lg hover:bg-gold/90 transition-colors font-semibold"
            >
              Return to Home
            </Link>
            <Link
              href="mailto:contactus@rcweb.dev"
              className="flex-1 text-center px-6 py-3 border border-gold/50 text-gold rounded-lg hover:bg-gold/10 transition-colors font-semibold"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-400 text-sm mt-6 font-inter mx-auto">
          You&apos;ll receive a confirmation email shortly with all the details.
        </p>
      </motion.div>
    </div>
  );
}
