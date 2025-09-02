"use client";

import { BriefcaseIcon } from "@heroicons/react/24/outline";
import { experience } from "@/libs/data";
import useSectionObserver from "@/hooks/useSectionObserver";
import { motion } from "framer-motion";

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
    <section ref={ref} id="experience" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="flex justify-center items-center gap-2">
            <div className="flex justify-center">
              <BriefcaseIcon className="w-10 h-10 text-gold" />
            </div>
            <h2 className="text-4xl font-iceland tracking-tight text-gold sm:text-6xl">
              Experience
            </h2>
          </div>
          <p className="mt-4 text-lg font-inter text-white/80">
            My professional journey in software development
          </p>
        </div>

        {/* Experience Cards - Zigzag Layout */}
        <div className="relative max-w-5xl mx-auto">
          {/* Central line for desktop */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-gold/20 via-gold/40 to-gold/20"></div>

          {experience.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
                <div className="group bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gold/20 hover:border-gold/40 hover:bg-gold/5 transition-all duration-300">
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
                      <h3 className="text-xl font-iceland text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm font-inter text-gold/70">
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
                    className={`text-sm font-inter text-white/70 ${index % 2 === 0 ? "lg:text-right" : ""}`}
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
