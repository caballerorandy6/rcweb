"use client";

import { motion } from "framer-motion";
import Script from "next/script";
import {
  CalendarDaysIcon,
  ClockIcon,
  VideoCameraIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Heading from "@/app/components/ui/Heading";
import { trackFBPhoneCall } from "@/app/components/tracking/FacebookPixel";
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
  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
    <section className="relative isolate overflow-hidden py-24 sm:py-32 bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-4 w-72 h-72 bg-gold/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<CalendarDaysIcon className="w-8 text-gold" />}
          text="Let's Build Something Amazing Together"
        >
          Schedule Your Free Consultation
        </Heading>

        {/* Hero Section */}
        <motion.div
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
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
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
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
          ].map((benefit, index) => (
            <motion.div
              key={index}
              className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gold/20 p-6 hover:border-gold/40 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="text-gold mb-4">{benefit.icon}</div>
              <h2 className="text-xl font-bold text-gold font-iceland mb-2">
                {benefit.title}
              </h2>
              <p className="text-gray-300 text-sm font-inter">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* What We'll Discuss */}
        <motion.div
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
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
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3 text-gray-300"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                >
                  <span className="text-gold mt-1">✓</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Embedded Calendly Widget */}
        <motion.div
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gold/20 p-4 overflow-hidden">
            <div
              className="calendly-inline-widget"
              data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=111827&text_color=ffffff&primary_color=d4af37`}
              style={{ minWidth: "320px", height: "700px" }}
            />
          </div>
        </motion.div>

        {/* Alternative Contact Options */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-12 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.a
            href="tel:+13463757534"
            onClick={trackPhoneConversion}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold text-gray-900 font-bold rounded-lg hover:bg-gold/90 transition-colors font-inter text-lg"
          >
            <PhoneIcon className="w-6 h-6" />
            Call (346) 375-7534
          </motion.a>

          <Link
            href="/#contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-gold text-gold font-bold rounded-lg hover:bg-gold/10 transition-colors font-inter text-lg"
          >
            Send a Message
          </Link>
        </motion.div>

        {/* Contact Alternative */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
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
        </motion.div>
      </div>
    </section>
    </>
  );
}
