"use client";

import { motion } from "framer-motion";
import useSectionObserver from "@/hooks/useSectionObserver";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { services } from "@/lib/data";
import Heading from "@/app/components/ui/Heading";

const Services = () => {
  const ref = useSectionObserver({ sectionName: "Services" });

  return (
    <section
      id="services"
      ref={ref}
      className="relative isolate overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-24 bg-gray-900"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<Cog6ToothIcon className="w-8 text-gold" />}
          text="Transform ideas into high-performance web applications that drive your business forward"
        >
          How I Can Help You
        </Heading>

        <ul className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-2 lg:gap-8">
          {services.map((service, index) => (
            <motion.li
              key={service.title}
              initial={false}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              style={{ opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: index * 0.1,
              }}
              className="group relative flex flex-col gap-6 rounded-2xl border border-gold/20 bg-gray-900/50 p-6 lg:p-8 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-gold/50 hover:bg-gold/5 shadow-lg shadow-black/20"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 ring-1 ring-gold/30">
                  <service.icon className="h-6 w-6 text-gold" />
                </div>
                <h2 className="text-xl font-iceland text-white">
                  {service.title}
                </h2>
              </div>

              <p className="text-sm sm:text-base font-inter text-white/80 leading-relaxed">
                {service.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {service.features.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center rounded-full bg-gold/10 px-3 py-1 text-xs font-inter text-gold ring-1 ring-inset ring-gold/20"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-gold/10">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-inter text-gold/80 italic">
                    {service.highlight}
                  </p>
                  <p className="text-sm font-inter font-semibold text-gold">
                    {service.price}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  document
                    .getElementById("pricing")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base font-inter font-semibold text-gold border-2 border-gold/50 hover:bg-gold/10 hover:border-gold/60 rounded-lg transition-all duration-200 hover:scale-105"
              >
                Get Quote
                <span>→</span>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Services;
