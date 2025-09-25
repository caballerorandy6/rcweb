"use client";

import { useState } from "react";
import useSectionObserver from "@/hooks/useSectionObserver";
import {
  ChevronDownIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { faqs } from "@/lib/data";
import Heading from "../Heading";

const FAQ = () => {
  const ref = useSectionObserver({ sectionName: "FAQ" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
                  <h3 className="text-lg font-iceland text-gold">
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
