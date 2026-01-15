"use client";

import { BriefcaseIcon } from "@heroicons/react/24/outline";
import { experience } from "@/lib/data";
import useSectionObserver from "@/hooks/useSectionObserver";
import { motion } from "framer-motion";
import Heading from "../ui/Heading";

export interface ExperienceProps {
  title: string;
  company: string;
  location: string;
  description: string;
  icon: React.ReactNode;
  date: string;
}

const Experience = () => {
  const ref = useSectionObserver({ sectionName: "Experience" });

  return (
    <section
      ref={ref}
      id="experience"
      className="pt-24 sm:pt-32 pb-16 sm:pb-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<BriefcaseIcon className="w-8 text-gold" />}
          text="My professional journey in software development."
        >
          Experience
        </Heading>

        {/* Experience Cards - Zigzag Layout */}
        <div className="relative max-w-5xl mx-auto mt-12">
          {/* Central line for desktop */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-gold/20 via-gold/40 to-gold/20"></div>

          {experience.map((item, index) => (
            <motion.div
              key={`${item.title}-${item.company}`}
              initial={false}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: index * 0.1,
              }}
              style={{ opacity: 1 }}
              className={`relative flex items-center mb-12 lg:mb-16 ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              }`}
            >
              {/* Date Badge - Desktop */}
              <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
                <div className="bg-gold text-gray-900 px-4 py-2 rounded-full text-sm font-inter font-semibold whitespace-nowrap">
                  {item.date}
                </div>
              </div>

              {/* Content Card */}
              <div
                className={`w-full lg:w-5/12 ${index % 2 === 0 ? "lg:pr-12 lg:text-right" : "lg:pl-12"}`}
              >
                <div className="group bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-gold/20 hover:border-gold/50 hover:bg-gold/5 transition-all duration-300 shadow-lg shadow-black/20">
                  {/* Icon */}
                  <div
                    className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? "lg:flex-row-reverse" : ""}`}
                  >
                    <div className="flex-shrink-0 w-12 h-12 text-gold rounded-xl flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div
                      className={`${index % 2 === 0 ? "lg:text-right" : ""}`}
                    >
                      <h2 className="text-xl font-iceland text-white">
                        {item.title}
                      </h2>
                      <p className="text-sm font-inter text-gold/80">
                        {item.company} • {item.location}
                      </p>
                    </div>
                  </div>

                  {/* Date Badge - Mobile */}
                  <div className="lg:hidden mb-3">
                    <span className="inline-block bg-gold/10 text-gold px-3 py-1 rounded-full text-xs font-inter">
                      {item.date}
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    className={`text-sm sm:text-base font-inter text-white/80 leading-relaxed ${index % 2 === 0 ? "lg:text-right" : ""}`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
