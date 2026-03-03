"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    _linkedin_data_partner_ids?: string[];
    lintrk?: (action: string, data?: Record<string, unknown>) => void;
  }
}

const LINKEDIN_PARTNER_ID = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID;

// LinkedIn Conversion ID for "Contact Form Lead - rcweb.dev"
// Created in LinkedIn Campaign Manager: Measurement > Conversion tracking
const LINKEDIN_CONVERSION_ID = 26696657;

export default function LinkedInInsightTag() {
  const pathname = usePathname();

  useEffect(() => {
    if (!LINKEDIN_PARTNER_ID) return;

    // Page views are tracked automatically by the Insight Tag
    // No need to manually track page views here
  }, [pathname]);

  // Don't render if no partner ID
  if (!LINKEDIN_PARTNER_ID) return null;

  return null;
}

// Helper function for tracking conversions (form submissions, leads, etc.)
export const trackLinkedInConversion = () => {
  if (typeof window !== "undefined" && window.lintrk) {
    window.lintrk("track", {
      conversion_id: LINKEDIN_CONVERSION_ID,
    });
  }
};
