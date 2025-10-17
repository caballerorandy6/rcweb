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

export default function LinkedInInsightTag() {
  const pathname = usePathname();

  useEffect(() => {
    if (!LINKEDIN_PARTNER_ID) return;

    // Track page views
    if (window.lintrk) {
      window.lintrk("track", { conversion_id: LINKEDIN_PARTNER_ID });
      console.log("LinkedIn Insight PageView:", pathname);
    }
  }, [pathname]);

  useEffect(() => {
    console.log(
      "✅ LinkedIn Insight Tag loaded with Partner ID:",
      process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID
    );
  }, []);

  // Don't render if no partner ID
  if (!LINKEDIN_PARTNER_ID) return null;

  return null;
}

// Helper function for tracking conversions
export const trackLinkedInConversion = (conversionId?: string) => {
  if (typeof window !== "undefined" && window.lintrk) {
    window.lintrk("track", {
      conversion_id: conversionId || LINKEDIN_PARTNER_ID,
    });
  }
};
