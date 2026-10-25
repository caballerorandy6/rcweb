"use client";

import { useState } from "react";
import Script from "next/script";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";

const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL ||
  "https://calendly.com/rcwebsolutions/30min";

/** Calendly stays folded: the widget script only loads when someone asks for it */
export default function CalendlyEmbed() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button variant="secondary" size="lg" fullWidth onClick={() => setOpen(true)}>
        <CalendarDaysIcon className="h-5 w-5" aria-hidden="true" />
        Pick a time on the calendar
      </Button>
    );
  }

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
      />
      <div
        className="calendly-inline-widget rounded-xl overflow-hidden"
        data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=111827&text_color=ffffff&primary_color=d4af37`}
        style={{ minWidth: "280px", height: "660px" }}
      />
    </>
  );
}
