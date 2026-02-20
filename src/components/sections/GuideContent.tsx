"use client";

import { motion } from "framer-motion";
import {
  BookOpenIcon,
  DocumentArrowDownIcon,
  CheckBadgeIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Heading from "@/components/ui/Heading";
import { useState } from "react";
import { toast } from "sonner";
import { downloadGuideAction } from "@/actions/campaigns/downloadGuideAction";
import { trackFBLead } from "@/components/tracking/FacebookPixel";

export default function GuideContent() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Trigger client-side PDF download
      const link = document.createElement('a');
      link.href = '/web-development-guide.pdf';
      link.download = 'RC-Web-Development-Guide.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 2. Call Server Action to save email and send PDF via email
      const result = await downloadGuideAction(email);

      // 3. Handle result
      if (result.success) {
        // Track Facebook Lead conversion
        trackFBLead();

        if (result.emailSent) {
          toast.success("Guide downloaded and sent to your email!");
        } else {
          toast.success("Guide downloaded! Email delivery may be delayed.");
        }
        setEmail("");
      } else {
        toast.error(result.message || "Something went wrong. Please try again.");
      }

    } catch (error) {
      console.error('Download error:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative isolate overflow-hidden py-24 sm:py-32 bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-4 w-72 h-72 bg-gold/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Free Badge */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-600/20 border border-green-500/50 rounded-full">
            <CheckBadgeIcon className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-bold font-inter text-sm uppercase tracking-wide">
              100% Free
            </span>
          </div>
        </motion.div>

        <Heading
          icon={<BookOpenIcon className="w-8 text-gold" />}
          text="Your Essential Guide to Web Success"
        >
          Free Web Development Guide
        </Heading>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16 max-w-6xl mx-auto">
          {/* Left Column - Guide Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* Mock Book Cover */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gold/20 to-gold/5 backdrop-blur-lg rounded-2xl p-8 border-2 border-gold/30 shadow-2xl shadow-gold/20 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="text-center">
                  <BookOpenIcon className="w-20 h-20 text-gold mx-auto mb-6" />
                  <h2 className="text-3xl md:text-4xl font-black text-gold font-iceland mb-4">
                    Web Development Guide
                  </h2>
                  <p className="text-xl text-white/90 font-inter mb-2">
                    For Small Businesses
                  </p>
                  <p className="text-sm text-white/60 font-inter">
                    By RC Web Solutions LLC
                  </p>
                </div>

                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-2 text-white/80">
                    <LightBulbIcon className="w-5 h-5 text-gold" />
                    <span className="text-sm font-inter">
                      Expert Insights & Strategies
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <LightBulbIcon className="w-5 h-5 text-gold" />
                    <span className="text-sm font-inter">
                      Proven Tips & Best Practices
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <LightBulbIcon className="w-5 h-5 text-gold" />
                    <span className="text-sm font-inter">
                      Real-World Examples
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - What's Inside + Form */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* What's Inside */}
            <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gold/20 p-8">
              <h3 className="text-2xl font-bold text-gold font-iceland mb-6">
                What&apos;s Inside
              </h3>
              <ul className="space-y-4">
                {[
                  "How to choose the right web development approach",
                  "Understanding modern web technologies",
                  "Planning your website architecture",
                  "SEO fundamentals for small businesses",
                  "Website security best practices",
                  "Mobile-first design principles",
                  "Cost-effective development strategies",
                  "Maintenance and scaling tips",
                ].map((item) => (
                  <motion.li
                    key={item}
                    className="flex items-start gap-3 text-gray-300 font-inter"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <CheckBadgeIcon className="w-6 h-6 text-gold flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Download Form */}
            <div className="bg-gradient-to-r from-gold/10 to-gold/5 backdrop-blur-lg rounded-xl border border-gold/20 p-8">
              <h3 className="text-2xl font-bold text-gold font-iceland mb-4">
                Download Your Free Guide
              </h3>
              <p className="text-white/80 font-inter text-sm mb-6">
                Enter your email and we&apos;ll send you the guide instantly. No
                spam, ever.
              </p>

              <form onSubmit={handleDownload} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full p-4 bg-gray-800/80 text-white rounded-xl border border-gray-700/60 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 font-inter placeholder-gray-400"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-8 py-4 bg-gold text-gray-900 font-bold rounded-xl hover:bg-gold/90 transition-colors font-inter text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <DocumentArrowDownIcon className="w-6 h-6" />
                      Download Free Guide
                    </>
                  )}
                </motion.button>
              </form>

              <p className="text-white/50 font-inter text-xs mt-4 text-center">
                By downloading, you agree to receive occasional emails from RC
                Web Solutions.
                <br />
                You can unsubscribe anytime.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Why Download */}
        <motion.div
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gold/20 p-8 text-center">
            <h3 className="text-2xl font-bold text-gold font-iceland mb-4">
              Why We Created This Guide
            </h3>
            <p className="text-white/80 font-inter leading-relaxed max-w-2xl mx-auto">
              We&apos;ve worked with hundreds of small businesses and saw the
              same questions come up again and again. This guide answers those
              questions and gives you the knowledge to make informed decisions
              about your web presence. Whether you&apos;re building your first
              website or improving an existing one, this guide will save you
              time and money.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-white/70 font-inter mx-auto">
            Have questions? We&apos;re here to help.{" "}
            <Link
              href="/#contact"
              className="text-gold hover:text-gold/80 transition-colors font-bold"
            >
              Contact us →
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
