"use client";

import { useState } from "react";
import Script from "next/script";
import {
  CalendarDaysIcon,
  ClockIcon,
  VideoCameraIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import HeadingStatic from "@/components/ui/HeadingStatic";
import { trackFBPhoneCall } from "@/components/tracking/FacebookPixel";
import { trackManualContact } from "@/lib/analytics";

// Calendly configuration
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/rcwebsolutions/30min";

// Phone Conversion Tracking (Google Ads + Facebook)
const trackPhoneConversion = () => {
  // Google Ads manual contact conversion
  trackManualContact();

  // Legacy conversion tracking (keeping for backward compatibility)
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "conversion", {
      send_to: "AW-17661176254/wW9-CKCVjLAbEL7TwOVB",
      value: 1.0,
      currency: "USD",
    });
  }

  // Facebook Pixel conversion
  trackFBPhoneCall();
};

export default function ScheduleContent() {
  const [showCalendly, setShowCalendly] = useState(false);

  return (
    <>
      {/* Only load Calendly script when user wants to see the calendar */}
      {showCalendly && (
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="afterInteractive"
        />
      )}
    <section className="relative isolate overflow-hidden py-24 sm:py-32 bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-4 w-72 h-72 bg-gold/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <HeadingStatic
          icon={<CalendarDaysIcon className="w-8 text-gold" />}
          text="Let's Build Something Amazing Together"
        >
          Schedule Your Free Consultation
        </HeadingStatic>

        {/* Hero Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-gold/10 to-gold/5 backdrop-blur-lg rounded-2xl p-8 border border-gold/20 shadow-xl shadow-black/50">
            <p className="text-white/90 text-lg leading-relaxed font-inter text-center">
              Book a{" "}
              <span className="text-gold font-bold">
                free 30-minute consultation
              </span>{" "}
              to discuss your web development project. No commitment required –
              just an opportunity to explore how we can help bring your vision
              to life.
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: <ClockIcon className="w-8 h-8" />,
              title: "30 Minutes",
              description:
                "Dedicated time to understand your project needs and goals",
            },
            {
              icon: <VideoCameraIcon className="w-8 h-8" />,
              title: "Video or Phone",
              description:
                "Choose your preferred method – Zoom, Google Meet, or phone call",
            },
            {
              icon: <PhoneIcon className="w-8 h-8" />,
              title: "No Obligation",
              description:
                "100% free consultation with zero commitment required",
            },
          ].map((benefit) => (
            <div
              key={benefit.title}
              className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gold/20 p-6 hover:border-gold/40 hover:scale-105 transition-all duration-300"
            >
              <div className="text-gold mb-4">{benefit.icon}</div>
              <h2 className="text-xl font-bold text-gold font-iceland mb-2">
                {benefit.title}
              </h2>
              <p className="text-gray-300 text-sm font-inter">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* What We'll Discuss */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gold/20 p-8">
            <h2 className="text-3xl font-bold text-gold font-iceland mb-6 text-center">
              What We&apos;ll Discuss
            </h2>
            <ul className="space-y-4 font-inter">
              {[
                "Your project goals and vision",
                "Technical requirements and stack recommendations",
                "Timeline and milestones",
                "Budget and pricing options",
                "Next steps and project roadmap",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-gray-300"
                >
                  <span className="text-gold mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Embedded Calendly Widget - Lazy loaded on click */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gold/20 p-4 overflow-hidden">
            {showCalendly ? (
              <div
                className="calendly-inline-widget"
                data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=111827&text_color=ffffff&primary_color=d4af37`}
                style={{ minWidth: "320px", height: "700px" }}
              />
            ) : (
              <button
                onClick={() => setShowCalendly(true)}
                className="w-full py-16 flex flex-col items-center justify-center gap-6 hover:bg-gold/5 transition-colors duration-300 rounded-lg group"
              >
                <div className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center group-hover:bg-gold/30 transition-colors">
                  <CalendarDaysIcon className="w-12 h-12 text-gold" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gold font-iceland mb-2">
                    View Available Times
                  </h3>
                  <p className="text-gray-400 font-inter text-sm max-w-md">
                    Click to load the calendar and choose a time that works for you
                  </p>
                </div>
                <div className="px-8 py-4 bg-gold text-gray-900 font-bold rounded-xl hover:bg-gold/90 transition-colors font-inter text-lg flex items-center gap-2">
                  <CalendarDaysIcon className="w-6 h-6" />
                  Open Calendar
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Alternative Contact Options */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12 justify-center">
          <a
            href="tel:+13463757534"
            onClick={trackPhoneConversion}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold text-gray-900 font-bold rounded-lg hover:bg-gold/90 hover:scale-105 active:scale-95 transition-all duration-200 font-inter text-lg"
          >
            <PhoneIcon className="w-6 h-6" />
            Call (346) 375-7534
          </a>

          <Link
            href="/#contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-gold text-gold font-bold rounded-lg hover:bg-gold/10 hover:scale-105 active:scale-95 transition-all duration-200 font-inter text-lg"
          >
            Send a Message
          </Link>
        </div>

        {/* Contact Alternative */}
        <div className="mt-8 text-center">
          <p className="text-white/70 font-inter mx-auto text-sm">
            Can&apos;t find a time that works?{" "}
            <a
              href="mailto:contactus@rcweb.dev"
              className="text-gold hover:text-gold/80 transition-colors font-bold"
            >
              Email us directly
            </a>
          </p>
        </div>
      </div>
    </section>
    </>
  );
}
