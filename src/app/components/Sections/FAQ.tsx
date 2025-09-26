"use client";

import { useState } from "react";
import useSectionObserver from "@/hooks/useSectionObserver";
import {
  ChevronDownIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { faqs } from "@/lib/data";
import Heading from "../Heading";
import { motion, Variants, AnimatePresence } from "framer-motion";

const FAQ = () => {
  const ref = useSectionObserver({ sectionName: "FAQ" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Variantes para la animación de las tarjetas
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const answerVariants: Variants = {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: { opacity: 0, height: 0, transition: { duration: 0.25 } },
  };

  return (
    <section
      id="faq"
      ref={ref}
      className="relative isolate overflow-hidden pt-24 sm:pt-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<QuestionMarkCircleIcon />}
          text="Everything you need to know before we start"
        >
          Frequently Asked Questions
        </Heading>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mt-16 max-w-3xl"
        >
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="rounded-lg border border-gold/20 bg-gray-900/50 backdrop-blur-sm transition-all duration-200 hover:border-gold/50"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <h3 className="text-lg font-iceland text-gold">
                    {faq.question}
                  </h3>
                  <ChevronDownIcon
                    className={`h-5 w-5 text-gold transition-transform duration-200 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      key="answer"
                      variants={answerVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="px-6 pb-4 overflow-hidden"
                    >
                      <p className="text-sm font-inter text-white/70">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
