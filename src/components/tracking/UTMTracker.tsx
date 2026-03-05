"use client";

import { useEffect } from "react";

const STORAGE_KEY = "rcweb_utm_params";

/**
 * Component that captures UTM parameters from URL on page load.
 * Should be placed in the root layout to capture params on any landing page.
 */
export default function UTMTracker() {
  useEffect(() => {
    // Only capture if we don't already have stored params
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {
      utmSource: urlParams.get("utm_source"),
      utmMedium: urlParams.get("utm_medium"),
      utmCampaign: urlParams.get("utm_campaign"),
      utmTerm: urlParams.get("utm_term"),
      utmContent: urlParams.get("utm_content"),
      referrer: document.referrer || null,
      landingPage: window.location.pathname,
    };

    // Only store if we have at least one UTM param or referrer
    const hasData =
      utmParams.utmSource ||
      utmParams.utmMedium ||
      utmParams.utmCampaign ||
      utmParams.referrer;

    if (hasData) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utmParams));
    }
  }, []);

  return null;
}
