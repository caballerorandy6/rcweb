"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ClockIcon,
  ChartBarIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

const stats = [
  { value: "15", label: "Hours Saved Weekly", suffix: "+" },
  { value: "3", label: "Week Delivery", suffix: "" },
  { value: "95", label: "Lighthouse Score", suffix: "+" },
  { value: "24/7", label: "Availability", suffix: "" },
];

const techStack = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Tailwind UI",
  "Prisma",
  "PostgreSQL",
  "Docker",
  "Zod",
  "Zustand",
];

const challenges = [
  {
    icon: ClockIcon,
    title: "Time-Consuming Admin Tasks",
    description:
      "Michel was spending 15+ hours per week on repetitive administrative tasks like managing service requests, tracking leads, and sending follow-up emails manually.",
  },
  {
    icon: EnvelopeIcon,
    title: "No Email Marketing System",
    description:
      "No efficient way to reach potential and existing customers. All marketing was done through word-of-mouth and expensive traditional advertising.",
  },
  {
    icon: DevicePhoneMobileIcon,
    title: "Outdated Website",
    description:
      "The old website was not mobile-friendly, slow to load, and didn't convert visitors into leads effectively.",
  },
];

const solutions = [
  {
    title: "Custom Admin Dashboard",
    description:
      "Built a comprehensive admin panel to manage service requests, customer data, and business operations from one place.",
    features: [
      "Real-time service request management",
      "Customer database with search & filters",
      "Automated status updates",
      "Analytics and reporting",
    ],
  },
  {
    title: "Bulk Email Campaign System",
    description:
      "Integrated email marketing capabilities allowing Michel to reach thousands of customers with promotional offers and updates.",
    features: [
      "Email template builder",
      "Contact list management",
      "Campaign scheduling",
      "Open & click tracking",
    ],
  },
  {
    title: "Modern Responsive Website",
    description:
      "Redesigned the entire public-facing website with a focus on conversions, SEO, and mobile experience.",
    features: [
      "95+ Lighthouse performance score",
      "Mobile-first responsive design",
      "SEO optimization for local search",
      "Fast loading with Next.js",
    ],
  },
];

const results = [
  {
    metric: "15+ Hours Saved Weekly",
    description: "Automated workflows eliminated repetitive manual tasks",
    icon: ClockIcon,
  },
  {
    metric: "Increased Customer Reach",
    description: "Email campaigns now reach thousands of customers instantly",
    icon: EnvelopeIcon,
  },
  {
    metric: "Better Lead Conversion",
    description: "Modern website converts more visitors into service requests",
    icon: ChartBarIcon,
  },
];

export default function CaseStudyContent() {
  return (
    <main className="bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-900" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[150px]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors font-inter text-sm"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Projects
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6">
                <span className="text-gold text-sm font-inter font-medium">
                  Case Study
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-iceland mb-6">
                GSM A/C &{" "}
                <span className="text-gold">General Contractor</span>
              </h1>

              <p className="text-white/70 font-inter text-lg mb-8 max-w-xl">
                How we helped a Houston HVAC company save 15+ hours per week
                with a custom admin dashboard and automated email marketing
                system.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://www.gsmactx.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-gray-900 font-bold rounded-xl hover:bg-gold/90 transition-colors font-inter"
                >
                  Visit Live Site
                  <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                </a>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gold/50 text-gold font-semibold rounded-xl hover:bg-gold/10 transition-colors font-inter"
                >
                  Start Your Project
                </Link>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-gold/20 shadow-2xl shadow-black/50">
                <Image
                  src="/gsmactx.avif"
                  alt="GSM AC Website Screenshot"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gold/10"
              >
                <div className="text-3xl sm:text-4xl font-bold text-gold font-iceland">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-white/60 text-sm font-inter mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-sm font-semibold text-gold font-inter uppercase tracking-wider">
              Technologies Used
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3"
          >
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-gray-800 text-white/80 rounded-lg text-sm font-inter border border-gray-700"
              >
                {tech}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Challenges */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-iceland mb-4">
              The <span className="text-gold">Challenges</span>
            </h2>
            <p className="text-white/60 font-inter max-w-2xl mx-auto">
              Before working with us, GSM AC faced several operational
              challenges that were holding back business growth.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-red-500/20"
              >
                <challenge.icon className="w-10 h-10 text-red-400 mb-4" />
                <h3 className="text-xl font-bold text-white font-iceland mb-3">
                  {challenge.title}
                </h3>
                <p className="text-white/60 font-inter text-sm">
                  {challenge.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-20 bg-gray-800/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-iceland mb-4">
              Our <span className="text-gold">Solutions</span>
            </h2>
            <p className="text-white/60 font-inter max-w-2xl mx-auto">
              We built a comprehensive solution that addressed all challenges
              and transformed their business operations.
            </p>
          </motion.div>

          <div className="space-y-12">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gold/20"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gold font-iceland mb-4">
                      {solution.title}
                    </h3>
                    <p className="text-white/70 font-inter">
                      {solution.description}
                    </p>
                  </div>
                  <div>
                    <ul className="space-y-3">
                      {solution.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-white/80 font-inter text-sm"
                        >
                          <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-iceland mb-4">
              The <span className="text-gold">Results</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {results.map((result, index) => (
              <motion.div
                key={result.metric}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-b from-gold/10 to-transparent rounded-xl p-8 border border-gold/30 text-center"
              >
                <result.icon className="w-12 h-12 text-gold mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gold font-iceland mb-2">
                  {result.metric}
                </h3>
                <p className="text-white/60 font-inter text-sm">
                  {result.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-gray-800/30">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-gold/20 text-center"
          >
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className="w-6 h-6 text-gold fill-current"
                />
              ))}
            </div>
            <blockquote className="text-xl sm:text-2xl text-white font-inter italic mb-8 leading-relaxed">
              &ldquo;Randy and his team transformed our business operations. The
              admin dashboard alone saves me over 15 hours every week. The email
              system lets me reach all my customers with just a few clicks.
              Highly recommend RC Web Solutions!&rdquo;
            </blockquote>
            <div>
              <div className="text-gold font-bold font-iceland text-lg">
                Michel Chapelli
              </div>
              <div className="text-white/60 font-inter text-sm">
                Owner, GSM A/C & General Contractor Inc.
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-iceland mb-4">
              Ready to Transform{" "}
              <span className="text-gold">Your Business?</span>
            </h2>
            <p className="text-white/60 font-inter mb-8 max-w-xl mx-auto">
              Let&apos;s discuss how we can build a custom solution that saves
              you time and grows your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold text-gray-900 font-bold rounded-xl hover:bg-gold/90 transition-colors font-inter text-lg"
              >
                Start Your Project
              </Link>
              <Link
                href="/schedule"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gold/50 text-gold font-semibold rounded-xl hover:bg-gold/10 transition-colors font-inter"
              >
                Schedule a Call
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
