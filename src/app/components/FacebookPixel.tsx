"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    fbq?: (
      action: string,
      event: string,
      data?: Record<string, unknown>
    ) => void;
  }
}

const FACEBOOK_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export default function FacebookPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!FACEBOOK_PIXEL_ID) return;

    // Track page views
    if (window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname, searchParams]);

  // Don't render script if no pixel ID
  if (!FACEBOOK_PIXEL_ID) return null;

  return null;
}

// Helper functions for tracking specific events
export const trackFBEvent = (
  eventName: string,
  data?: Record<string, unknown>
) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, data);
  }
};

// Specific event trackers
export const trackFBPurchase = (value: number, currency = "USD") => {
  trackFBEvent("Purchase", { value, currency });
};

export const trackFBLead = () => {
  trackFBEvent("Lead");
};

export const trackFBContact = () => {
  trackFBEvent("Contact");
};

export const trackFBViewContent = (contentName: string) => {
  trackFBEvent("ViewContent", { content_name: contentName });
};

export const trackFBPhoneCall = () => {
  trackFBEvent("Contact", { contact_type: "phone" });
};
