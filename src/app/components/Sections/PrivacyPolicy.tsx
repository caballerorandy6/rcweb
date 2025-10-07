"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import Heading from "@/app/components/Heading";
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import useSectionObserver from "@/hooks/useSectionObserver";
import { sections } from "@/lib/data";
import { thirdPartyLinks } from "@/lib/data";

export default function PrivacyPolicy() {
  const ref = useSectionObserver({ sectionName: "Privacy Policy" });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };

  return (
    <section
      id="privacy"
      ref={ref}
      className="relative isolate overflow-hidden py-24 sm:py-32  bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-900"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-4 w-72 h-72 bg-gold/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<ShieldCheckIcon className="w-8 text-gold" />}
          text="Your Privacy Matters"
        >
          Privacy Policy
        </Heading>

        {/* Introduction Card */}
        <motion.div
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="bg-gradient-to-r from-gold/10 to-gold/5 backdrop-blur-lg rounded-2xl p-8 border border-gold/20 shadow-xl shadow-black/50">
            <p className="text-white/90 text-lg leading-relaxed font-inter">
              This Privacy Policy describes our policies and procedures on the
              collection, use and disclosure of your information when you use
              our Service. By using the Service, you agree to the collection and
              use of information in accordance with this Privacy Policy.
            </p>
            <div className="mt-4 flex items-center gap-2 text-gold/70 text-sm">
              <InformationCircleIcon className="w-5 h-5" />
              <span className="font-inter">
                Last updated: September 25, 2025
              </span>
            </div>
          </div>
        </motion.div>

        {/* Company Information */}
        <motion.div
          className="mt-8 max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 text-white/70 text-sm font-inter">
            <span className="font-bold text-gold">RC Web Solutions LLC</span>
            <span className="hidden sm:inline">•</span>
            <span>Houston, TX 77085</span>
            <span className="hidden sm:inline">•</span>
            <a
              href="https://rcweb.dev"
              className="text-gold hover:text-gold/80 transition-colors"
            >
              rcweb.dev
            </a>
          </div>
        </motion.div>

        {/* Privacy Sections Grid */}
        <motion.div
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative overflow-hidden bg-gray-900/60 backdrop-blur-md rounded-xl border border-gold/20 hover:border-gold/40 transition-all duration-300"
              whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 17 } }}
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="relative p-6">
                {/* Header with Icon */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gold/10 rounded-lg text-gold group-hover:bg-gold/20 transition-colors">
                    {section.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gold font-iceland tracking-wide">
                    {section.title}
                  </h3>
                </div>

                {/* Content */}
                <p className="text-gray-100 leading-relaxed text-sm font-inter">
                  {section.content}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Third Party Services */}
        <motion.div
          className="mt-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gold/20 p-8">
            <h3 className="text-xl font-bold text-gold font-iceland mb-6 text-center">
              Third-Party Service Privacy Policies
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {thirdPartyLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800/50 hover:bg-gold/10 border border-gold/10 hover:border-gold/30 rounded-lg p-3 text-center transition-all duration-200"
                  whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 17 } }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-gold text-sm font-inter">
                    {link.name}
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          className="mt-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="bg-gradient-to-r from-gold/10 to-transparent backdrop-blur-md rounded-xl border border-gold/20 p-8">
            <h3 className="text-xl font-bold text-gold font-iceland mb-6">
              Contact Us About Privacy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-inter">
              <a
                href="mailto:contactus@rcweb.dev"
                className="flex items-center gap-3 text-white/80 hover:text-gold transition-colors group"
              >
                <EnvelopeIcon className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
                <span className="text-sm">contactus@rcweb.dev</span>
              </a>
              <a
                href="tel:3463757534"
                className="flex items-center gap-3 text-white/80 hover:text-gold transition-colors group"
              >
                <PhoneIcon className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
                <span className="text-sm">346-375-7534</span>
              </a>
              <Link
                href="/#contact"
                className="flex items-center gap-3 text-white/80 hover:text-gold transition-colors group"
              >
                <DocumentTextIcon className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
                <span className="text-sm">Contact Form</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-12 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
        >
          <motion.a
            href="https://www.privacypolicies.com/live/1efd6eca-e9ce-4dc7-89dc-8b8e5cb8102a"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 17 } }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-gray-900 font-bold rounded-lg hover:bg-gold/90 transition-colors font-inter"
          >
            <GlobeAltIcon className="w-5 h-5" />
            View Full Policy
          </motion.a>

          <motion.a
            href="/privacy-policy.pdf"
            download="RC-Web-Privacy-Policy.pdf"
            whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 17 } }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border-2 border-gold text-gold font-bold rounded-lg hover:bg-gold/10 transition-colors font-inter"
          >
            <DocumentTextIcon className="w-5 h-5" />
            Download PDF
          </motion.a>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.4 }}
        >
          <p className="text-white/50 text-sm font-inter">
            For GDPR purposes, RC Web Solutions LLC is the Data Controller
          </p>
        </motion.div>
      </div>
    </section>
  );
}
