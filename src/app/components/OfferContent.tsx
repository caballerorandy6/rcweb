"use client";

import { motion } from "framer-motion";
import { SparklesIcon, ClockIcon, RocketLaunchIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Heading from "@/app/components/Heading";
import { useState, useEffect } from "react";

export default function OfferContent() {
  // Countdown timer (7 days from now)
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const endDate = new Date(now + 7 * 24 * 60 * 60 * 1000).getTime();
      const distance = endDate - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate overflow-hidden py-24 sm:py-32 bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="absolute top-0 -left-4 w-96 h-96 bg-gold/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-gold/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Limited Time Badge */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-600/20 border border-red-500/50 rounded-full">
            <ClockIcon className="w-5 h-5 text-red-400 animate-pulse" />
            <span className="text-red-400 font-bold font-inter text-sm uppercase tracking-wide">
              Limited Time Offer
            </span>
          </div>
        </motion.div>

        <Heading
          icon={<SparklesIcon className="w-8 text-gold" />}
          text="Save Big on Professional Web Development"
        >
          20% OFF All Projects
        </Heading>

        {/* Main Offer Card */}
        <motion.div
          className="mt-16 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="bg-gradient-to-br from-gold/20 via-gold/10 to-transparent backdrop-blur-lg rounded-3xl p-8 md:p-12 border-2 border-gold/30 shadow-2xl shadow-gold/20">
            {/* Discount Badge */}
            <div className="text-center mb-8">
              <motion.div
                className="inline-block"
                animate={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              >
                <div className="text-8xl md:text-9xl font-black text-gold font-iceland">
                  20<span className="text-6xl md:text-7xl">%</span>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white font-iceland -mt-4">
                  OFF
                </div>
              </motion.div>
            </div>

            <p className="text-white/90 text-xl md:text-2xl leading-relaxed font-inter text-center max-w-3xl mx-auto mb-8">
              Get <span className="text-gold font-bold">20% discount</span> on professional web development services.
              Perfect timing to launch that project you&apos;ve been planning!
            </p>

            {/* Countdown Timer */}
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map((item, index) => (
                <div key={index} className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gold/20 p-4">
                  <div className="text-3xl md:text-4xl font-black text-gold font-iceland text-center">
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs md:text-sm text-white/60 font-inter text-center mt-1">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <motion.a
                href="/#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-gold text-gray-900 font-black rounded-xl hover:bg-gold/90 transition-colors font-inter text-xl shadow-xl shadow-gold/30"
              >
                <RocketLaunchIcon className="w-7 h-7" />
                Claim Your 20% Discount Now
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* What's Included */}
        <motion.div
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gold/20 p-8">
            <h2 className="text-3xl font-bold text-gold font-iceland mb-8 text-center">
              This Offer Applies To
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Full-Stack Web Applications",
                "E-Commerce Websites",
                "Landing Pages",
                "Custom CMS Development",
                "API Development & Integration",
                "Website Redesign Projects",
                "Progressive Web Apps (PWA)",
                "Mobile-Responsive Websites"
              ].map((service, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * index }}
                >
                  <CheckCircleIcon className="w-6 h-6 text-gold flex-shrink-0" />
                  <span className="text-gray-300 font-inter">{service}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Terms */}
        <motion.div
          className="mt-12 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-gray-900/40 backdrop-blur-sm rounded-lg border border-gold/10 p-6">
            <h3 className="text-lg font-bold text-gold font-iceland mb-3">Offer Terms:</h3>
            <ul className="space-y-2 text-sm text-gray-400 font-inter">
              <li>• Valid for new projects only</li>
              <li>• 20% discount applied to total project cost</li>
              <li>• Must mention this offer when contacting us</li>
              <li>• Cannot be combined with other promotions</li>
              <li>• Project must be started within 30 days of agreement</li>
            </ul>
          </div>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-white/70 font-inter text-sm">
            Join 50+ satisfied clients who&apos;ve transformed their digital presence with RC Web Solutions
          </p>
          <Link href="/#testimonials" className="text-gold hover:text-gold/80 transition-colors font-bold text-sm">
            Read testimonials →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
