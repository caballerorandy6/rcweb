"use client";

import useSectionObserver from "@/hooks/useSectionObserver";
import { CheckIcon } from "@heroicons/react/24/outline";
import { pricingPlans } from "@/libs/data";

const Pricing = () => {
  const ref = useSectionObserver({ sectionName: "Pricing" });

  return (
    <section
      id="pricing"
      ref={ref}
      className="relative isolate overflow-hidden py-24 sm:py-32 bg-gray-950"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-iceland tracking-tight text-gold sm:text-6xl">
            Clear & Transparent Pricing
          </h2>
          <p className="mt-6 text-lg font-inter text-white/80">
            USD pricing for clients in Houston and LATAM
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl ${
                plan.featured
                  ? "border-2 border-gold ring-2 ring-gold/20 scale-105"
                  : "border border-gold/20"
              } bg-gray-900/50 p-8 backdrop-blur-sm transition-all duration-200 hover:border-gold/50 hover:bg-gold/5`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-gold px-4 py-1 text-xs font-inter text-gray-900">
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-2xl font-iceland text-white">
                  {plan.name}
                </h3>
                <p className="mt-4 flex items-baseline gap-x-2">
                  <span className="text-4xl font-iceland text-gold">
                    {plan.price}
                  </span>
                  <span className="text-sm font-inter text-white/50">USD</span>
                </p>
                <p className="mt-2 text-sm font-inter text-gold/70">
                  {plan.range} • {plan.duration}
                </p>
                <p className="mt-4 text-base font-inter text-white/70">
                  {plan.description}
                </p>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon className="h-5 w-5 flex-none text-gold" />
                    <span className="text-sm font-inter text-white/70">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-sm font-inter text-gold/50 italic">
                {plan.ideal}
              </p>

              <button
                className={`mt-8 w-full text-sm font-inter p-3 rounded-md transition-all duration-200 ease-in-out hover:scale-105 ${
                  plan.featured
                    ? "bg-gold text-gray-900 hover:bg-gold/90"
                    : "text-white/80 hover:bg-gold/20 border border-gold/50"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-2xl text-center">
          <p className="text-sm font-inter text-white/50">
            All projects include: Source code • Domain & hosting setup •
            Training • Payment: 30% upfront, 40% milestone, 30% delivery
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
