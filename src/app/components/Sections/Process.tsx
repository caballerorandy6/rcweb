"use client";

import React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSectionObserver from "@/hooks/useSectionObserver";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { processSteps } from "@/libs/data";
import Heading from "@/app/components/Heading";

const Process = () => {
  const ref = useSectionObserver({ sectionName: "Process" });
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="process" ref={ref} className="pt-24 sm:pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<ChevronRightIcon className="w-8 text-gold" />}
          text="From idea to reality in 4-6 weeks with complete transparency"
        >
          My Work Process
        </Heading>

        {/* Desktop: Interactive Horizontal Steps */}
        <div className="hidden lg:block mt-12">
          {/* Step Indicators */}
          <div className="flex justify-between items-center max-w-4xl mx-auto mb-12">
            {processSteps.map((step, index) => (
              <div key={index} className="flex-1 relative">
                {/* Connection Line */}
                {index < processSteps.length - 1 && (
                  <div className="absolute top-6 left-1/2 w-full h-0.5 bg-gold/20">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: activeStep > index ? "100%" : "0%" }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gold"
                    />
                  </div>
                )}

                {/* Step Circle */}
                <button
                  onClick={() => setActiveStep(index)}
                  className="relative z-10 mx-auto flex"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      activeStep >= index
                        ? "bg-gold text-gray-900"
                        : "bg-gray-800 text-gold border-2 border-gold/30"
                    }`}
                  >
                    <span className="font-bold font-inter">{index + 1}</span>
                  </motion.div>
                </button>

                {/* Step Title */}
                <p className="mt-3 text-xs font-inter text-center text-white/50">
                  {step.week}
                </p>
              </div>
            ))}
          </div>

          {/* Active Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-gray-950/50 backdrop-blur-sm rounded-2xl p-8 border border-gold/20">
                {/* Icon and Title */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center">
                    {React.createElement(processSteps[activeStep].icon, {
                      className: "w-7 h-7 text-gold",
                    })}
                  </div>
                  <div>
                    <h3 className="text-2xl font-iceland text-white">
                      Step {activeStep + 1}: {processSteps[activeStep].title}
                    </h3>
                    <p className="text-sm font-inter text-gold/70">
                      {processSteps[activeStep].week}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-base font-inter text-white/80 mb-6">
                  {processSteps[activeStep].description}
                </p>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {processSteps[activeStep].details.map((detail, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center text-sm font-inter text-white/60"
                    >
                      <ChevronRightIcon className="w-4 h-4 text-gold mr-2 flex-shrink-0" />
                      {detail}
                    </motion.div>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                    disabled={activeStep === 0}
                    className={`px-4 py-2 rounded-lg font-inter text-sm transition-all ${
                      activeStep === 0
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                        : "bg-gold/10 text-gold hover:bg-gold/20"
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setActiveStep(
                        Math.min(processSteps.length - 1, activeStep + 1)
                      )
                    }
                    disabled={activeStep === processSteps.length - 1}
                    className={`px-4 py-2 rounded-lg font-inter text-sm transition-all ${
                      activeStep === processSteps.length - 1
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                        : "bg-gold text-gray-900 hover:bg-gold/90"
                    }`}
                  >
                    Next Step
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile: Accordion Style */}
        <div className="lg:hidden space-y-4">
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => setActiveStep(activeStep === index ? -1 : index)}
                className="w-full bg-gray-950/50 rounded-xl p-4 border border-gold/20 hover:border-gold/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-gold text-gray-900 rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </span>
                    <div className="text-left">
                      <h3 className="font-iceland text-white">{step.title}</h3>
                      <p className="text-xs font-inter text-gold/70">
                        {step.week}
                      </p>
                    </div>
                  </div>
                  <ChevronRightIcon
                    className={`w-5 h-5 text-gold transition-transform ${
                      activeStep === index ? "rotate-90" : ""
                    }`}
                  />
                </div>

                <AnimatePresence>
                  {activeStep === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-gold/10">
                        <p className="text-sm font-inter text-white/70 mb-4">
                          {step.description}
                        </p>
                        <div className="space-y-2">
                          {step.details.map((detail, idx) => (
                            <div
                              key={idx}
                              className="flex items-start text-xs font-inter text-white/50"
                            >
                              <span className="text-gold mr-2">•</span>
                              {detail}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
