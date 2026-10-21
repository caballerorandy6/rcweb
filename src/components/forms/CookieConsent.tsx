"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import {
  closeCookieSettings,
  setCookieConsent,
  useCookieConsent,
} from "@/lib/cookieConsent";

/** Delay for first-time visitors so the banner never competes with the LCP. */
const FIRST_VISIT_DELAY_MS = 5000;

const CookieConsent = () => {
  const { consent, settingsOpen } = useCookieConsent();
  const [delayElapsed, setDelayElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDelayElapsed(true), FIRST_VISIT_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const isVisible = settingsOpen || (consent === null && delayElapsed);
  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 animate-slide-up"
      role="region"
      aria-labelledby="cookie-settings-title"
    >
      <div className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gray-900/95 backdrop-blur-lg p-6 sm:p-8 shadow-2xl">
          <div className="absolute inset-0 bg-linear-to-br from-gold/5 via-transparent to-transparent opacity-50" />

          {settingsOpen && consent !== null ? (
            <button
              type="button"
              onClick={closeCookieSettings}
              aria-label="Close cookie settings"
              className="absolute top-3 right-3 z-10 rounded-full p-1.5 text-white/60 hover:text-gold hover:bg-white/5 transition-colors focus:outline-hidden focus:ring-2 focus:ring-gold/50"
            >
              <XMarkIcon className="w-5 h-5" aria-hidden="true" />
            </button>
          ) : null}

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h2
                id="cookie-settings-title"
                className="text-lg font-inter font-semibold text-white mb-2"
              >
                Cookie Settings
              </h2>
              <div className="space-y-2">
                <p className="text-sm sm:text-base font-inter text-white/70 leading-relaxed">
                  We use cookies to keep the site working and, with your
                  permission, to measure traffic and ad performance.{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-gold hover:text-gold/80 underline transition-colors"
                  >
                    Read our Privacy Policy
                  </Link>
                </p>
                <div className="text-xs font-inter text-white/50 bg-gray-800/50 p-2 rounded-sm">
                  <strong className="text-white/70">Essential:</strong> site
                  functionality and spam protection on forms (Google reCAPTCHA)
                  <br />
                  <strong className="text-white/70">Optional:</strong> Google
                  Analytics, Google Ads, Meta Pixel, LinkedIn Insight Tag
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                variant="secondary"
                onClick={() => setCookieConsent("rejected")}
              >
                Essential Only
              </Button>
              <Button onClick={() => setCookieConsent("accepted")}>
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
