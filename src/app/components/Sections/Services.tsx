"use client";

import { motion } from "framer-motion";
import useSectionObserver from "@/hooks/useSectionObserver";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { services } from "@/lib/data";
import Heading from "@/app/components/Heading";

const Services = () => {
  const ref = useSectionObserver({ sectionName: "Services" });

  return (
    <section
      id="services"
      ref={ref}
      className="relative isolate overflow-hidden pt-24 md:pt-32 bg-gray-950"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<Cog6ToothIcon className="w-8 text-gold" />}
          text="Transform ideas into high-performance web applications that drive
            your business forward"
        >
          How I Can Help You
        </Heading>

        <ul className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
          {services.map((service, index) => (
            <motion.li
              key={index}
              initial={{
                opacity: 0,
                x: index % 2 === 0 ? -50 : 50,
              }}
              whileInView={{
                opacity: 1,
                x: 1,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
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

              <button
                onClick={() => {
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="mt-4 text-sm font-inter text-white/80 hover:bg-gold/20 p-2 rounded-md border border-gold/50 transition-all duration-200 ease-in-out hover:scale-105"
              >
                Get Quote →
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Services;
