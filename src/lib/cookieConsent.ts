import { useSyncExternalStore } from "react";

/**
 * Single source of truth for the visitor's cookie choice.
 *
 * The choice lives in localStorage; this module caches it after the first
 * read and lets React subscribe through `useCookieConsent`. The server
 * snapshot always reports "no choice yet", so the banner is never part of the
 * HTML and there is no hydration mismatch.
 */

export type CookieConsent = "accepted" | "rejected" | null;

interface ConsentState {
  consent: CookieConsent;
  /** True while the visitor reopened the banner from "Cookie Settings". */
  settingsOpen: boolean;
}

const STORAGE_KEY = "cookie-consent";
const SERVER_STATE: ConsentState = { consent: null, settingsOpen: false };

let state: ConsentState = SERVER_STATE;
let hydrated = false;
const listeners = new Set<() => void>();

function readStored(): CookieConsent {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

function getSnapshot(): ConsentState {
  if (!hydrated) {
    hydrated = true;
    state = { consent: readStored(), settingsOpen: false };
  }
  return state;
}

function getServerSnapshot(): ConsentState {
  return SERVER_STATE;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function update(next: ConsentState) {
  state = next;
  listeners.forEach((listener) => listener());
}

/** Google Consent Mode v2: everything but security follows the one choice. */
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

export function setCookieConsent(consent: "accepted" | "rejected") {
  const previous = getSnapshot().consent;
  try {
    localStorage.setItem(STORAGE_KEY, consent);
  } catch {
    // Private mode or blocked storage: the choice still applies to this page.
  }
  update({ consent, settingsOpen: false });
  applyGtagConsent(consent === "accepted");

  // Third-party pixels already running cannot be unloaded; a reload is the
  // only way to honour a withdrawal.
  if (previous === "accepted" && consent === "rejected") {
    window.location.reload();
  }
}

/** Reopens the banner so a visitor can change an earlier choice. */
export function openCookieSettings() {
  update({ ...getSnapshot(), settingsOpen: true });
}

export function closeCookieSettings() {
  update({ ...getSnapshot(), settingsOpen: false });
}

/** Re-sends the stored choice to gtag on a new page load. */
export function syncGtagConsent() {
  if (getSnapshot().consent === "accepted") applyGtagConsent(true);
}

export function useCookieConsent(): ConsentState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
