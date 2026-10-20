import {
  ChevronDownIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { faqs } from "@/lib/data";
import Heading from "../ui/Heading";

/** Native exclusive accordion: <details name> needs no JS and stays crawlable */
const FAQ = () => {
  return (
    <section
      id="faq"
      className="relative isolate overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<QuestionMarkCircleIcon />}
          text="Everything you need to know before we start"
        >
          Frequently Asked Questions
        </Heading>

        <div className="mx-auto mt-16 max-w-3xl space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              name="faq"
              open={index === 0}
              className="accordion group reveal rounded-2xl border border-gold/20 bg-gray-900/50 transition-colors duration-200 hover:border-gold/50 shadow-lg shadow-black/20"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-left [&::-webkit-details-marker]:hidden">
                <h3 className="text-base sm:text-lg font-inter font-semibold text-gold">
                  {faq.question}
                </h3>
                <ChevronDownIcon
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-gold transition-transform duration-200 group-open:rotate-180"
                />
              </summary>

              <div className="px-6 pb-4">
                <p className="text-sm sm:text-base font-inter text-white/80 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
