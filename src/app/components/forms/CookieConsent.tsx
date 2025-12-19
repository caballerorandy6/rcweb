"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface CookieConsentProps {
  onAccept: () => void;
  onReject: () => void;
}

const CookieConsent = ({ onAccept, onReject }: CookieConsentProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setIsVisible(true), 1000);
    } else {
      // Load scripts based on stored preference
      if (consent === "accepted") {
        onAccept();
      }
    }
  }, [onAccept]);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
    onAccept();
  };

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setIsVisible(false);
    onReject();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
          role="dialog"
          aria-live="polite"
          aria-label="Cookie consent banner"
        >
          <div className="mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gray-900/95 backdrop-blur-lg p-6 sm:p-8 shadow-2xl">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-50" />

              <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-5 h-5 text-gold flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                    <h2 className="text-lg sm:text-xl font-iceland text-white">
                      Cookie Settings
                    </h2>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm sm:text-base font-inter text-white/70 leading-relaxed">
                      We use cookies to improve your experience. Essential cookies
                      (reCAPTCHA for form protection) are required. Optional
                      cookies help us analyze traffic and improve our marketing.{" "}
                      <Link
                        href="/privacy-policy"
                        className="text-gold hover:text-gold/80 underline transition-colors"
                      >
                        Read our Privacy Policy
                      </Link>
                    </p>
                    <div className="text-xs font-inter text-white/50 bg-gray-800/50 p-2 rounded">
                      <strong className="text-white/70">Essential:</strong> Google
                      reCAPTCHA (anti-bot protection)
                      <br />
                      <strong className="text-white/70">Optional:</strong> Google
                      Analytics, Google Ads, Facebook Pixel, LinkedIn Ads
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleReject}
                    className="px-6 py-2.5 rounded-lg font-inter text-sm text-white/80 border-2 border-gold/30 hover:border-gold/50 hover:bg-gold/5 transition-all duration-200"
                    aria-label="Reject optional cookies (essential cookies will remain active)"
                  >
                    Essential Only
                  </button>
                  <button
                    onClick={handleAccept}
                    className="px-6 py-2.5 rounded-lg font-inter text-sm bg-gold text-gray-900 hover:bg-gold/90 transition-all duration-200 font-semibold"
                    aria-label="Accept all cookies including marketing and analytics"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
