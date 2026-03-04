"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpenIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { trackFBLead } from "@/components/tracking/FacebookPixel";
import { trackLinkedInConversion } from "@/components/tracking/LinkedInInsightTag";
import { event as trackEvent } from "@/lib/analytics";

const LeadMagnetBanner = () => {
  const handleClick = () => {
    // Track engagement with lead magnet
    trackEvent({
      action: "lead_magnet_click",
      category: "engagement",
      label: "homepage_banner",
    });
  };

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-gold/10" />

      {/* Animated glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-gold/20 rounded-full blur-[100px] animate-pulse" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="relative bg-gray-900/80 backdrop-blur-xl border border-gold/30 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-black/50"
        >
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Icon/Visual */}
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              className="flex-shrink-0"
            >
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-gold via-gold-light to-gold flex items-center justify-center shadow-lg shadow-gold/30">
                  <BookOpenIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-900" />
                </div>
                {/* Free badge */}
                <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg font-inter uppercase tracking-wide">
                  Free
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <div className="flex-1 text-center lg:text-left">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-iceland mb-3"
              >
                Get Your Free{" "}
                <span className="text-gold">Web Development Guide</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-white/70 font-inter text-base sm:text-lg max-w-xl mx-auto lg:mx-0"
              >
                Learn SEO fundamentals, security best practices, and cost-effective strategies to grow your online presence.
              </motion.p>
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="flex-shrink-0"
            >
              <Link
                href="/guide"
                onClick={handleClick}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gold via-gold-light to-gold hover:from-gold-light hover:via-gold hover:to-gold-dark text-gray-900 font-bold rounded-xl transition-all duration-300 shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/40 font-inter text-lg"
              >
                Download Now
                <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          {/* Stats/Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 pt-6 border-t border-white/10 flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-10"
          >
            {[
              { value: "8+", label: "Chapters" },
              { value: "100%", label: "Free" },
              { value: "PDF", label: "Format" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-gold font-iceland">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-white/50 font-inter">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default LeadMagnetBanner;
