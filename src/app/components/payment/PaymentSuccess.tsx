"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  DocumentDuplicateIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import type { Payment } from "@/generated/prisma/client";
import { trackLeadConversion, trackPurchase } from "@/lib/analytics";

interface PaymentSuccessClientProps {
  payment?: Payment | null;
  error?: string;
  projectCode?: string;
  fallbackUsed?: boolean;
}

export default function PaymentSuccess({
  payment,
  error,
  projectCode,
  fallbackUsed,
}: PaymentSuccessClientProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (payment && !error) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Track purchase conversion (payment completed)
      const paymentAmount = payment.firstPaid && payment.secondPaid
        ? payment.totalAmount
        : payment.firstPaid
          ? payment.firstPayment
          : payment.secondPayment;

      trackPurchase(
        paymentAmount / 100, // Convert cents to dollars
        'USD',
        payment.firstSessionId || payment.secondSessionId || undefined
      );

      // Track lead conversion (payment completed = lead converted to customer)
      trackLeadConversion();

      if (fallbackUsed) {
        toast.warning("Payment processed with fallback method", {
          description:
            "Your payment was successful but processed through our backup system.",
        });
      }
    }
  }, [payment, error, fallbackUsed]);

  const copyToClipboard = () => {
    if (projectCode) {
      navigator.clipboard.writeText(projectCode);
      setCopied(true);
      toast.success("Project code copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (error) {
    return (
      // <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      //   <motion.div
      //     initial={{ opacity: 0, scale: 0.95 }}
      //     animate={{ opacity: 1, scale: 1 }}
      //     className="max-w-md w-full bg-red-900/20 border border-red-500/50 rounded-2xl p-8 text-center"
      //   >
      //     <div className="text-red-500 mb-4">
      //       <ExclamationTriangleIcon className="w-16 h-16 mx-auto" />
      //     </div>
      //     <h2 className="text-2xl font-bold text-white mb-2">
      //       Payment Processing Issue
      //     </h2>
      //     <p className="text-gray-300 mb-6">{error}</p>
      //     <p className="text-sm text-gray-400 mb-6">
      //       Don&#39;t worry! If your payment was successful in Stripe, we&#39;ll
      //       process it shortly. Please save your confirmation email.
      //     </p>
      //     <a
      //       href="mailto:contactus@rcweb.dev"
      //       className="inline-block px-6 py-3 bg-gold text-gray-900 rounded-lg hover:bg-gold/90 transition-colors"
      //     >
      //       Contact Support
      //     </a>
      //   </motion.div>
      // </div>
      <>{console.log("Payment Processing Issue, fallback used:", error)}</>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center px-4  py-24 sm:py-32">
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
            Payment Successful! 🎉
          </h1>

          <p className="text-gray-300 text-center mb-8 font-inter">
            Thank you for your payment. Your project has been initiated and
            we&#39;ll be in touch within 24 hours.
          </p>

          {/* Fallback Warning if used */}
          {fallbackUsed && (
            <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-yellow-500 font-semibold text-sm">
                    Backup Processing Used
                  </p>
                  <p className="text-yellow-200/80 text-xs mt-1">
                    Your payment was processed successfully through our backup
                    system. Everything is fine!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Project Code Display */}
          {projectCode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.4 }}
              className="bg-gradient-to-r from-gold/20 to-yellow-500/20 rounded-xl p-6 mb-8 border border-gold/30 font-inter flex flex-col items-center"
            >
              <p className="text-sm text-gold mb-2 text-center uppercase tracking-wide">
                Your Project Code
              </p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-3xl font-mono font-bold text-gold tracking-wider">
                  {projectCode}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-gold/20 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  <DocumentDuplicateIcon
                    className={`w-6 h-6 ${copied ? "text-green-500" : "text-gold"}`}
                  />
                </button>
              </div>
              <p className="text-xs text-center mt-3 text-gray-400">
                Save this code - you&#39;ll need it for the final payment
              </p>
            </motion.div>
          )}

          {/* Payment Details */}
          {payment && (
            <div className="space-y-3 mb-8 font-inter">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Plan:</span>
                <span className="text-white font-medium">
                  {payment.planName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Amount Paid:</span>
                <span className="text-green-500 font-medium">
                  ${(payment.firstPayment / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Remaining Balance:</span>
                <span className="text-yellow-500 font-medium">
                  ${(payment.secondPayment / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Status:</span>
                <span className="text-blue-500 font-medium">In Progress</span>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-900/20 rounded-lg p-4 mb-8 border border-blue-500/30 font-inter">
            <h3 className="text-blue-400 font-semibold mb-2">
              What happens next?
            </h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>
                • We&#39;ll contact you within 24 hours to discuss project
                details
              </li>
              <li>
                • Development will begin based on your selected plan timeline
              </li>
              <li>
                • You&#39;ll receive updates throughout the development process
              </li>
              <li>• Final payment will be due upon project completion</li>
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
          You&#39;ll receive a confirmation email shortly with all the details.
        </p>
      </motion.div>
    </div>
  );
}
