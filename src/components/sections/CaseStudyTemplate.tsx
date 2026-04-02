"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  StarIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ClockIcon,
  ChartBarIcon,
  VideoCameraIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  globe: GlobeAltIcon,
  search: MagnifyingGlassIcon,
  envelope: EnvelopeIcon,
  phone: DevicePhoneMobileIcon,
  clock: ClockIcon,
  chart: ChartBarIcon,
  star: StarIcon,
  video: VideoCameraIcon,
  wrench: WrenchScrewdriverIcon,
};

type Stat = {
  value: string;
  label: string;
  suffix: string;
};

type Challenge = {
  icon: string;
  title: string;
  description: string;
};

type Solution = {
  title: string;
  description: string;
  features: string[];
};

type Result = {
  metric: string;
  description: string;
  icon: string;
};

type Testimonial = {
  quote: string;
  author: string;
  company: string;
};

export type CaseStudyData = {
  name: string;
  nameHighlight: string;
  subtitle: string;
  siteUrl: string;
  image: string;
  imageAlt: string;
  stats: Stat[];
  techStack: string[];
  challengesIntro: string;
  challenges: Challenge[];
  solutionsIntro: string;
  solutions: Solution[];
  results: Result[];
  testimonial?: Testimonial;
  ctaTitle: string;
  ctaTitleHighlight: string;
  ctaDescription: string;
  ctaLinks: { label: string; href: string; primary?: boolean }[];
};

export default function CaseStudyTemplate({ data }: { data: CaseStudyData }) {
  return (
    <main className="bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-900" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[150px]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href={"/#projects" as Route}
              className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors font-inter text-sm"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Projects
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
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
                {data.name}{" "}
                <span className="text-gold">{data.nameHighlight}</span>
              </h1>

              <p className="text-white/70 font-inter text-lg mb-8 max-w-xl">
                {data.subtitle}
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href={data.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-gray-900 font-bold rounded-xl hover:bg-gold/90 transition-colors font-inter"
                >
                  Visit Live Site
                  <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                </a>
                <Link
                  href={"/schedule" as Route}
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gold/50 text-gold font-semibold rounded-xl hover:bg-gold/10 transition-colors font-inter"
                >
                  Start Your Project
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-gold/20 shadow-2xl shadow-black/50">
                <Image
                  src={data.image}
                  alt={data.imageAlt}
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
            {data.stats.map((stat) => (
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
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-sm font-semibold text-gold font-inter uppercase tracking-wider">Technologies Used</h2>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex flex-wrap justify-center gap-3">
            {data.techStack.map((tech) => (
              <span key={tech} className="px-4 py-2 bg-gray-800 text-white/80 rounded-lg text-sm font-inter border border-gray-700">{tech}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Challenges */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-iceland mb-4">The <span className="text-gold">Challenges</span></h2>
            <p className="text-white/60 font-inter max-w-2xl mx-auto">{data.challengesIntro}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {data.challenges.map((challenge, index) => (
              <motion.div key={challenge.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-red-500/20">
                {(() => { const Icon = iconMap[challenge.icon]; return Icon ? <Icon className="w-10 h-10 text-red-400 mb-4" /> : null; })()}
                <h3 className="text-xl font-bold text-white font-iceland mb-3">{challenge.title}</h3>
                <p className="text-white/60 font-inter text-sm">{challenge.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-20 bg-gray-800/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-iceland mb-4">Our <span className="text-gold">Solutions</span></h2>
            <p className="text-white/60 font-inter max-w-2xl mx-auto">{data.solutionsIntro}</p>
          </motion.div>
          <div className="space-y-12">
            {data.solutions.map((solution, index) => (
              <motion.div key={solution.title} initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gold/20">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gold font-iceland mb-4">{solution.title}</h3>
                    <p className="text-white/70 font-inter">{solution.description}</p>
                  </div>
                  <div>
                    <ul className="space-y-3">
                      {solution.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-white/80 font-inter text-sm">
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
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-iceland mb-4">The <span className="text-gold">Results</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {data.results.map((result, index) => (
              <motion.div key={result.metric} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-gradient-to-b from-gold/10 to-transparent rounded-xl p-8 border border-gold/30 text-center">
                {(() => { const Icon = iconMap[result.icon]; return Icon ? <Icon className="w-12 h-12 text-gold mx-auto mb-4" /> : null; })()}
                <h3 className="text-xl font-bold text-gold font-iceland mb-2">{result.metric}</h3>
                <p className="text-white/60 font-inter text-sm">{result.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {data.testimonial && (
        <section className="py-20 bg-gray-800/30">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-gold/20 text-center">
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-6 h-6 text-gold fill-current" />
                ))}
              </div>
              <blockquote className="text-xl sm:text-2xl text-white font-inter italic mb-8 leading-relaxed">
                &ldquo;{data.testimonial.quote}&rdquo;
              </blockquote>
              <div>
                <div className="text-gold font-bold font-iceland text-lg">{data.testimonial.author}</div>
                <div className="text-white/60 font-inter text-sm">{data.testimonial.company}</div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className={`py-20 ${data.testimonial ? "" : "bg-gray-800/30"}`}>
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-iceland mb-4">
              {data.ctaTitle} <span className="text-gold">{data.ctaTitleHighlight}</span>
            </h2>
            <p className="text-white/60 font-inter mb-8 max-w-xl mx-auto">{data.ctaDescription}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {data.ctaLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href as Route}
                  className={`inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-xl transition-colors font-inter ${
                    link.primary
                      ? "bg-gold text-gray-900 font-bold hover:bg-gold/90 text-lg"
                      : "border-2 border-gold/50 text-gold hover:bg-gold/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
