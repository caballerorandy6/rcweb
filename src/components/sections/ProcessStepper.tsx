"use client";

import { useState, type ReactNode } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";

export interface StepperStep {
  title: string;
  week: string;
  description: string;
  details: string[];
  icon: ReactNode;
}

interface ProcessStepperProps {
  steps: StepperStep[];
}

/** Desktop stepper: the only state of the Process section (active step) */
export default function ProcessStepper({ steps }: ProcessStepperProps) {
  const [activeStep, setActiveStep] = useState(0);
  const currentStep = steps[activeStep] ?? steps[0];
  const lastIndex = steps.length - 1;

  return (
    <>
      {/* Step Indicators */}
      <div className="flex justify-between items-center max-w-4xl mx-auto mb-12">
        {steps.map((step, index) => (
          <div key={step.title} className="flex-1 relative">
            {/* Connection Line (compositor-only: scales instead of animating width) */}
            {index < lastIndex && (
              <div className="absolute top-6 left-1/2 w-full h-0.5 bg-gold/20">
                <div
                  className={`h-full bg-gold origin-left transition-transform duration-500 ease-out ${
                    activeStep > index ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </div>
            )}

            {/* Step Circle */}
            <button
              type="button"
              onClick={() => setActiveStep(index)}
              aria-current={activeStep === index ? "step" : undefined}
              aria-label={`Step ${index + 1}: ${step.title}`}
              className={`relative z-10 mx-auto flex w-12 h-12 rounded-full items-center justify-center transition duration-300 hover:scale-110 active:scale-95 ${
                activeStep >= index
                  ? "bg-gold text-gray-900"
                  : "bg-gray-800 text-gold border-2 border-gold/30"
              }`}
            >
              <span className="font-bold font-inter">{index + 1}</span>
            </button>

            <p className="mt-3 text-xs sm:text-sm font-inter text-center text-white/60">
              {step.week}
            </p>
          </div>
        ))}
      </div>

      {/* Active Step Content: the key remounts it so the entrance replays */}
      <div key={activeStep} className="max-w-3xl mx-auto animate-enter">
        <div className="bg-gray-900/50 rounded-2xl p-6 lg:p-8 border border-gold/20 shadow-lg shadow-black/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center">
              {currentStep.icon}
            </div>
            <div>
              <h3 className="text-2xl font-iceland text-white">
                Step {activeStep + 1}: {currentStep.title}
              </h3>
              <p className="text-sm font-inter text-gold/80">
                {currentStep.week}
              </p>
            </div>
          </div>

          <p className="text-sm sm:text-base font-inter text-white/80 mb-6 leading-relaxed">
            {currentStep.description}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {currentStep.details.map((detail, idx) => (
              <div
                key={detail}
                style={{ animationDelay: `${idx * 100}ms` }}
                className="flex items-center text-sm font-inter text-white/60 animate-enter"
              >
                <ChevronRightIcon className="w-4 h-4 text-gold mr-2 shrink-0" />
                {detail}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
              disabled={activeStep === 0}
            >
              Previous
            </Button>
            <Button
              size="lg"
              onClick={() => setActiveStep((s) => Math.min(lastIndex, s + 1))}
              disabled={activeStep === lastIndex}
            >
              Next Step
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
