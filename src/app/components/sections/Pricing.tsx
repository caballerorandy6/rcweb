"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import useSectionObserver from "@/hooks/useSectionObserver";
import { CheckIcon } from "@heroicons/react/24/outline";
import { pricingPlans } from "@/lib/data";
import Heading from "../ui/Heading";
import { motion, Variants } from "framer-motion";
import { toast } from "sonner";

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isPending, startTransition] = useTransition();

  const ref = useSectionObserver({ sectionName: "Pricing" });
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  };

  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
    setShowModal(true);
  };

  const handleGoToTerms = () => {
    const plan = pricingPlans.find((p) => p.id === selectedPlan);
    if (!plan) return;
    if (!customerEmail || !customerName) {
      toast.error("Please fill in all fields");
      return;
    }

    // Solo redirigir a términos con los datos necesarios
    startTransition(() => {
      const params = new URLSearchParams({
        planId: plan.id,
        planName: plan.name,
        planPrice: plan.priceInCents.toString(),
        planDescription: plan.description,
        customerEmail,
        customerName,
      });

      router.push(`/terms-of-service?${params.toString()}`);
    });
  };

  return (
    <section
      id="pricing"
      ref={ref}
      className="relative isolate overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<CheckIcon />}
          text="Pricing in USD • Serving clients in the US and worldwide"
        >
          Clear & Transparent Pricing
        </Heading>

        <motion.div
          variants={containerVariants}
          initial={false}
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
          style={{ opacity: 1 }}
        >
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={cardVariants}
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
                <h2 className="text-2xl font-iceland text-white">
                  {plan.name}
                </h2>
                <p className="mt-4 flex items-baseline gap-x-2">
                  <span className="text-4xl font-iceland text-gold">
                    {plan.price}
                  </span>
                  <span className="text-sm font-inter text-white/60">USD</span>
                </p>
                <p className="mt-2 text-sm font-inter text-gold/80">
                  {plan.range} • {plan.duration}
                </p>
                <p className="mt-4 text-sm sm:text-base font-inter text-white/80 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon className="h-5 w-5 flex-none text-gold" />
                    <span className="text-sm font-inter text-white/80">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-sm font-inter text-gold/70 italic">
                {plan.ideal}
              </p>

              <button
                onClick={() => handlePlanSelection(plan.id)}
                className={`mt-8 w-full relative inline-flex items-center justify-center py-4 text-lg font-semibold rounded-xl transition-all duration-300 font-inter group overflow-hidden transform hover:scale-[1.02] active:scale-[0.98] ${
                  plan.featured
                    ? "text-black bg-gradient-to-r from-gold via-yellow-200 to-gold hover:from-yellow-200 hover:via-gold hover:to-yellow-200 shadow-lg hover:shadow-gold/25"
                    : "text-gold border-2 border-gold/50 hover:bg-gold/10 hover:border-gold/60"
                }`}
              >
                {plan.featured && (
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                )}
                <span className="relative flex items-center justify-center">
                  {plan.cta}
                </span>
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-gray-900/95 rounded-2xl p-8 max-w-md w-full border border-gold/20 shadow-2xl shadow-gold/10"
            >
              <h2 className="text-4xl font-bold text-gold mb-6 font-iceland">
                Complete Your Order
              </h2>

              <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gold/10 font-inter">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Selected Plan:</span>
                  <span className="text-gold font-bold">
                    {pricingPlans.find((p) => p.id === selectedPlan)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">
                    {selectedPlan === "website-maintenance"
                      ? "Monthly Payment:"
                      : "Initial Payment (50%):"}
                  </span>
                  <span className="text-2xl font-bold text-gold">
                    $
                    {selectedPlan === "website-maintenance"
                      ? (
                          (pricingPlans.find((p) => p.id === selectedPlan)
                            ?.priceInCents || 0) / 100
                        ).toFixed(2)
                      : (
                          ((pricingPlans.find((p) => p.id === selectedPlan)
                            ?.priceInCents || 0) *
                            0.5) /
                          100
                        ).toFixed(2)}
                    {selectedPlan === "website-maintenance" && (
                      <span className="text-sm font-normal text-gold/70">
                        /month
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div className="space-y-4 font-inter">
                <div>
                  <label className="block text-sm text-gray-300 mb-2 font-medium">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-3 bg-gray-800/70 text-white rounded-lg border border-gray-700 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full p-3 bg-gray-800/70 text-white rounded-lg border border-gray-700 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6 font-inter">
                <button
                  onClick={handleGoToTerms}
                  disabled={isPending}
                  className="relative flex-1 inline-flex items-center justify-center py-4 text-lg font-semibold text-black bg-gradient-to-r from-gold via-yellow-200 to-gold hover:from-yellow-200 hover:via-gold hover:to-yellow-200 rounded-xl transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter group overflow-hidden transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                  <span className="relative flex items-center justify-center">
                    {isPending ? "Loading..." : "Go to Terms & Pay"}
                  </span>
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  disabled={isPending}
                  className={`flex-1 inline-flex items-center justify-center px-6 py-3 text-sm sm:text-base font-semibold text-gold border-2 border-gold/50 hover:bg-gold/10 hover:border-gold/60 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isPending ? "cursor-wait" : ""
                  }`}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <div className="mx-auto mt-10 max-w-2xl text-center">
          <p className="text-sm font-inter text-white/50">
            All projects include: Source code • Domain & hosting setup •
            Training • Payment terms: 50% deposit, 50% on project completion
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
