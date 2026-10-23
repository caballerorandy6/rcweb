import { useSyncExternalStore } from "react";

/**
 * Visitor opt-out from Google Analytics / ad measurement.
 *
 * Measurement is on by default: the site serves US visitors, where no prior
 * consent is required, and a banner that most people ignore only threw the
 * data away. A visitor can switch measurement off from the Privacy Policy.
 * The choice lives in localStorage; an inline script in the root layout reads
 * it before gtag.js runs (Consent Mode default), and this module keeps React
 * in sync and updates gtag when the choice changes. The server snapshot is
 * always "not opted out", so there is no hydration mismatch.
 */

/** Keep in sync with the inline Consent Mode script in app/layout.tsx. */
export const ANALYTICS_OPT_OUT_KEY = "analytics-opt-out";

let hydrated = false;
let optedOut = false;
const listeners = new Set<() => void>();

function readStored(): boolean {
  try {
    return localStorage.getItem(ANALYTICS_OPT_OUT_KEY) === "1";
  } catch {
    return false;
  }
}

function getSnapshot(): boolean {
  if (!hydrated) {
    hydrated = true;
    optedOut = readStored();
  }
  return optedOut;
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Google Consent Mode v2: every storage type but security follows the choice. */
function applyGtagConsent(granted: boolean) {
  if (typeof window === "undefined" || !window.gtag) return;
  const value = granted ? "granted" : "denied";
  window.gtag("consent", "update", {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
    functionality_storage: value,
    personalization_storage: value,
  });
}

/** Best effort: drop the GA cookies so an opted-out visitor stops being identifiable. */
function clearGaCookies() {
  const names = document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=")[0])
    .filter((name) => name === "_ga" || name.startsWith("_ga_"));
  const bareHost = location.hostname.replace(/^www\./, "");
  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=${location.hostname}`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${bareHost}`;
  }
}

export function setAnalyticsOptOut(value: boolean) {
  try {
    if (value) localStorage.setItem(ANALYTICS_OPT_OUT_KEY, "1");
    else localStorage.removeItem(ANALYTICS_OPT_OUT_KEY);
  } catch {
    // Private mode or blocked storage: the choice still applies to this page.
  }
  hydrated = true;
  optedOut = value;
  listeners.forEach((listener) => listener());
  applyGtagConsent(!value);
  if (!value) return;

  clearGaCookies();
  // Ad pixels already running cannot be unloaded; a reload is the only way
  // to honour the withdrawal when a campaign has them switched on.
  if ("fbq" in window || "lintrk" in window) {
    window.location.reload();
  }
}

export function useAnalyticsOptOut(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
