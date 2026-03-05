"use client";

import { useEffect, useState } from "react";

export interface UTMParams {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  referrer: string | null;
  landingPage: string | null;
}

const STORAGE_KEY = "rcweb_utm_params";

/**
 * Hook to capture and persist UTM parameters from URL.
 * Stores in sessionStorage so params persist across page navigations.
 * Only captures on first visit (doesn't overwrite existing params).
 */
export function useUTMParams(): UTMParams {
  const [params, setParams] = useState<UTMParams>({
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    utmTerm: null,
    utmContent: null,
    referrer: null,
    landingPage: null,
  });

  useEffect(() => {
    // Check if we already have stored params
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setParams(JSON.parse(stored));
        return;
      } catch {
        // Invalid stored data, continue to capture fresh
      }
    }

    // Capture UTM params from URL
    const urlParams = new URLSearchParams(window.location.search);
    const newParams: UTMParams = {
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
      newParams.utmSource ||
      newParams.utmMedium ||
      newParams.utmCampaign ||
      newParams.referrer;

    if (hasData) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newParams));
      setParams(newParams);
    }
  }, []);

  return params;
}

/**
 * Get UTM params from sessionStorage (for server actions).
 * Call this in client components before submitting forms.
 */
export function getStoredUTMParams(): UTMParams | null {
  if (typeof window === "undefined") return null;

  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}
