"use client";

import { useState } from "react";
import Script from "next/script";
import {
  CalendarDaysIcon,
  ClockIcon,
  VideoCameraIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import { trackFBPhoneCall } from "@/components/tracking/FacebookPixel";
import { trackManualContact } from "@/lib/analytics";
import { trackLinkedInConversion } from "@/components/tracking/LinkedInInsightTag";
import { useInView } from "@/hooks/useInView";

// Calendly configuration
const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/rcwebsolutions/30min";

// Phone Conversion Tracking (Google Ads + Facebook + LinkedIn)
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

  // LinkedIn conversion
  trackLinkedInConversion();
};

export default function ScheduleContent() {
  const [showCalendly, setShowCalendly] = useState(false);

  // IntersectionObserver hooks for scroll animations
  const { ref: discussRef, isInView: discussInView } =
    useInView<HTMLDivElement>({ threshold: 0.2 });
  const { ref: contactRef, isInView: contactInView } =
    useInView<HTMLDivElement>({ threshold: 0.2 });
  const { ref: altContactRef, isInView: altContactInView } =
    useInView<HTMLDivElement>({ threshold: 0.2 });

  return (
    <>
      {/* Only load Calendly script when user wants to see the calendar */}
      {showCalendly && (
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="afterInteractive"
        />
      )}

      <section className="relative isolate overflow-hidden pt-8 pb-20 sm:pt-12 sm:pb-28 bg-linear-to-b from-gray-900 via-gray-900/95 to-gray-900">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
          <div className="absolute top-0 -left-4 w-72 h-72 rounded-full bg-radial from-gold/10 to-transparent to-70%"></div>
          <div className="absolute bottom-0 -right-4 w-72 h-72 rounded-full bg-radial from-gold/10 to-transparent to-70%"></div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Heading
            as="h1"
            icon={<CalendarDaysIcon className="w-8 text-gold" />}
            text="Let's Build Something Amazing Together"
          >
            Schedule Your Free Consultation
          </Heading>

          {/* Hero Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-linear-to-r from-gold/10 to-gold/5 rounded-2xl p-8 border border-gold/20 shadow-xl shadow-black/50">
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
                className="bg-gray-900/60 rounded-2xl border border-gold/20 p-6 hover:border-gold/40 hover:scale-105 transition-all duration-300"
              >
                <div className="text-gold mb-4">{benefit.icon}</div>
                <h2 className="text-2xl text-gold font-iceland mb-2">
                  {benefit.title}
                </h2>
                <p className="text-gray-300 text-sm font-inter">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* What We'll Discuss - Animated on scroll */}
          <div
            ref={discussRef}
            className={`mt-16 max-w-4xl mx-auto ${discussInView ? 'animate-fade-in-up' : 'opacity-0'}`}
          >
            <div className="bg-gray-900/60 rounded-2xl border border-gold/20 p-8">
              <h2 className="text-3xl text-gold font-iceland mb-6 text-center">
                What We&apos;ll Discuss
              </h2>
              <ul className="space-y-4 font-inter">
                {[
                  "Your project goals and vision",
                  "Technical requirements and stack recommendations",
                  "Timeline and milestones",
                  "Budget and pricing options",
                  "Next steps and project roadmap",
                ].map((item, index) => (
                  <li
                    key={item}
                    className={`flex items-start gap-3 text-gray-300 ${
                      discussInView ? 'animate-fade-in-left' : 'opacity-0'
                    }`}
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
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
            <div className="bg-gray-900/60 rounded-2xl border border-gold/20 p-4 overflow-hidden">
              {showCalendly ? (
                <div
                  className="calendly-inline-widget"
                  data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=111827&text_color=ffffff&primary_color=d4af37`}
                  style={{ minWidth: "320px", height: "700px" }}
                />
              ) : (
                <div className="w-full py-16 flex flex-col items-center justify-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center">
                    <CalendarDaysIcon className="w-12 h-12 text-gold" aria-hidden="true" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl text-gold font-iceland mb-2">
                      View Available Times
                    </h3>
                    <p className="text-gray-400 font-inter text-sm max-w-md">
                      Load the calendar and choose a time that works for you
                    </p>
                  </div>
                  <Button size="lg" onClick={() => setShowCalendly(true)}>
                    <CalendarDaysIcon className="w-6 h-6" aria-hidden="true" />
                    Open Calendar
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Alternative Contact Options - Animated on scroll */}
          <div
            ref={contactRef}
            className={`flex flex-col sm:flex-row gap-4 mt-12 justify-center ${
              contactInView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            <Button href="tel:+13463757534" onClick={trackPhoneConversion} size="lg">
              <PhoneIcon className="w-6 h-6" aria-hidden="true" />
              Call (346) 375-7534
            </Button>

            <Button href="/#contact" variant="secondary" size="lg">
              Send a Message
            </Button>
          </div>

          {/* Contact Alternative - Animated on scroll */}
          <div
            ref={altContactRef}
            className={`mt-8 text-center ${
              altContactInView ? 'animate-fade-in' : 'opacity-0'
            }`}
          >
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
