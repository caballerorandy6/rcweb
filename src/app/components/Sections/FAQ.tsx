"use client";

import { useState } from "react";
import useSectionObserver from "@/hooks/useSectionObserver";
import {
  ChevronDownIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { faqs } from "@/libs/data";

const FAQ = () => {
  const ref = useSectionObserver({ sectionName: "FAQ" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      ref={ref}
      className="relative isolate overflow-hidden py-24 sm:py-32 bg-gray-950"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center items-center gap-2">
            <div className="flex justify-center">
              <QuestionMarkCircleIcon className="w-10 h-10 text-gold" />
            </div>
            <h2 className="text-4xl font-iceland tracking-tight text-gold sm:text-6xl">
              Frequently Asked Questions
            </h2>
          </div>

          <p className="mt-6 text-lg font-inter text-white/80">
            Everything you need to know before we start
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-lg border border-gold/20 bg-gray-900/50 backdrop-blur-sm transition-all duration-200 hover:border-gold/50"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <h3 className="text-base font-iceland text-white">
                    {faq.question}
                  </h3>
                  <ChevronDownIcon
                    className={`h-5 w-5 text-gold transition-transform duration-200 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-sm font-inter text-white/70">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
