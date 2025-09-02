"use client";

import useSectionObserver from "@/hooks/useSectionObserver";
import {
  CodeBracketIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  CubeTransparentIcon,
} from "@heroicons/react/24/outline";

const services = [
  {
    icon: RocketLaunchIcon,
    title: "Full-Stack Web Applications",
    description:
      "Complete applications built with Next.js 14, TypeScript, and scalable databases.",
    features: ["SPA/SSR", "Admin Panel", "RESTful APIs", "Authentication"],
    highlight: "Like GSM AC, Limo Renting & Little Lemon Restaurant",
  },
  {
    icon: CodeBracketIcon,
    title: "High-Converting Landing Pages",
    description:
      "Optimized websites designed to convert visitors into customers with modern design.",
    features: ["Responsive", "SEO", "Analytics", "Animations"],
    highlight: "95+ Lighthouse Score",
  },
  {
    icon: CubeTransparentIcon,
    title: "Management Systems",
    description:
      "Custom dashboards to automate and manage your business efficiently.",
    features: ["Dashboard", "Reports", "Bulk Email", "User Management"],
    highlight: "15 hours/week saved",
  },
  {
    icon: ChartBarIcon,
    title: "Digital Consulting",
    description:
      "Web strategy and optimization with 3+ years of digital marketing experience.",
    features: ["Web Audit", "SEO", "WordPress", "Performance"],
    highlight: "60% more organic traffic",
  },
];

const Services = () => {
  const ref = useSectionObserver({ sectionName: "Services" });

  return (
    <section
      id="services"
      ref={ref}
      className="relative isolate overflow-hidden py-24 sm:py-32 bg-gray-950"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-iceland tracking-tight text-gold sm:text-6xl">
            How I Can Help You
          </h2>
          <p className="mt-6 text-lg font-inter text-white/80">
            Transform ideas into high-performance web applications that drive
            your business forward
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative flex flex-col gap-6 rounded-2xl border border-gold/20 bg-gray-900/50 p-8 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-gold/50 hover:bg-gold/5"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 ring-1 ring-gold/30">
                  <service.icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="text-xl font-iceland text-white">
                  {service.title}
                </h3>
              </div>

              <p className="text-base font-inter text-white/70">
                {service.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {service.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-full bg-gold/10 px-3 py-1 text-xs font-inter text-gold ring-1 ring-inset ring-gold/20"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-gold/10">
                <p className="text-sm font-inter text-gold/70 italic">
                  {service.highlight}
                </p>
              </div>

              <button className="mt-4 text-sm font-inter text-white/80 hover:bg-gold/20 p-2 rounded-md border border-gold/50 transition-all duration-200 ease-in-out hover:scale-105">
                Get Quote →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
