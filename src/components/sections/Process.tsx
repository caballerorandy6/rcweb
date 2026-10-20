import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { processSteps } from "@/lib/data";
import Heading from "@/components/ui/Heading";
import ProcessStepper from "@/components/sections/ProcessStepper";

const Process = () => {
  // Icons are rendered here so the client island receives plain nodes
  const steps = processSteps.map(({ icon: Icon, ...step }) => ({
    ...step,
    icon: <Icon className="w-7 h-7 text-gold" />,
  }));

  return (
    <section id="process" className="pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<ChevronRightIcon className="w-8 text-gold" />}
          text="Four steps from the first call to launch, with weekly demos along the way"
        >
          My Work Process
        </Heading>

        {/* Desktop: Interactive Horizontal Steps */}
        <div className="hidden lg:block mt-12">
          <ProcessStepper steps={steps} />
        </div>

        {/* Mobile: native accordion, no JS */}
        <div className="lg:hidden space-y-4 mt-12">
          {processSteps.map((step, index) => (
            <details
              key={step.title}
              name="process"
              className="accordion group reveal bg-gray-900/50 rounded-2xl border border-gold/20 hover:border-gold/50 transition-colors shadow-lg shadow-black/20"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 [&::-webkit-details-marker]:hidden">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 shrink-0 bg-gold text-gray-900 rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <div className="text-left">
                    <h3 className="font-inter font-semibold text-white">{step.title}</h3>
                    <p className="text-xs sm:text-sm font-inter text-gold/80">
                      {step.week}
                    </p>
                  </div>
                </div>
                <ChevronRightIcon
                  aria-hidden="true"
                  className="w-5 h-5 shrink-0 text-gold transition-transform group-open:rotate-90"
                />
              </summary>

              <div className="px-4 pb-4">
                <div className="pt-4 border-t border-gold/10">
                  <p className="text-sm sm:text-base font-inter text-white/80 mb-4 leading-relaxed">
                    {step.description}
                  </p>
                  <ul className="space-y-2">
                    {step.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-start text-sm font-inter text-white/70"
                      >
                        <span className="text-gold mr-2">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
