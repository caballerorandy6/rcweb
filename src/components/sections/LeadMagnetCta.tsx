"use client";

import Button from "@/components/ui/Button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { event as trackEvent } from "@/lib/analytics";

/** The only client bit of the lead magnet banner: the tracked download CTA */
export default function LeadMagnetCta() {
  const handleClick = () => {
    trackEvent({
      action: "lead_magnet_click",
      category: "engagement",
      label: "homepage_banner",
    });
  };

  return (
    <Button href="/guide" size="lg" onClick={handleClick}>
      Download Now
      <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
    </Button>
  );
}
