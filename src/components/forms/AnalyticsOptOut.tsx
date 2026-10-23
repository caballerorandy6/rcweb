"use client";

import { useId } from "react";
import { setAnalyticsOptOut, useAnalyticsOptOut } from "@/lib/analyticsOptOut";

/**
 * Switch in the Privacy Policy that lets a visitor turn Google Analytics
 * (and any ad pixel) off for this browser. Measurement is on by default.
 */
export default function AnalyticsOptOut() {
  const optedOut = useAnalyticsOptOut();
  const statusId = useId();

  return (
    <div className="mt-2 rounded-xl border border-gold/20 bg-gray-900/50 p-4">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={!optedOut}
          onChange={(event) => setAnalyticsOptOut(!event.target.checked)}
          aria-describedby={statusId}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-sm border-2 border-gray-700/60 bg-gray-800/80 text-gold transition duration-200 checked:border-gold checked:bg-gold hover:border-gold/50 focus:ring-2 focus:ring-gold/20 focus:ring-offset-0"
        />
        <span className="font-inter text-white/80">
          Allow Google Analytics to measure my visits
        </span>
      </label>
      <p
        id={statusId}
        aria-live="polite"
        className="mt-2 pl-8 font-inter text-sm text-white/50"
      >
        {optedOut
          ? "Measurement is off for this browser and the analytics cookies have been removed."
          : "Measurement is on. Untick the box to turn it off for this browser."}
      </p>
    </div>
  );
}
