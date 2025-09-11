"use client";

import { useState, useTransition } from "react";
import useSectionObserver from "@/hooks/useSectionObserver";
import { CheckIcon } from "@heroicons/react/24/outline";
import { pricingPlans } from "@/lib/data";
import Heading from "../Heading";
import { motion } from "framer-motion";
import { createCustomCheckoutSession } from "@/actions/createCustomCheckoutSession";
//import { createCheckoutSession } from "@/actions/createCheckoutSession";
import { toast } from "sonner";

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isPending, startTransition] = useTransition();

  const ref = useSectionObserver({ sectionName: "Pricing" });

  // 2. Definir las variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Tiempo entre la animación de cada tarjeta
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 }, // Empieza 50px abajo y transparente
    show: { opacity: 1, y: 0 }, // Termina en su posición original y visible
  };

  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
    setShowModal(true);
  };

  const handleCheckout = async () => {
    const plan = pricingPlans.find((p) => p.id === selectedPlan);
    if (!plan) return;

    if (!customerEmail || !customerName) {
      toast.error("Please fill in all fields");
      return;
    }

    startTransition(async () => {
      const result = await createCustomCheckoutSession(
        {
          name: plan.name,
          price: plan.priceInCents,
          description: plan.description,
        },
        { email: customerEmail, name: customerName }
      );

      if (result.success && result.sessionUrl) {
        // Redirigir a Stripe Checkout
        window.location.href = result.sessionUrl;
      } else {
        toast.error(result.error || "Failed to create checkout session");
      }
    });
  };

  return (
    <section
      id="pricing"
      ref={ref}
      className="relative isolate overflow-hidden pt-24 sm:pt-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<CheckIcon />}
          text="USD pricing for clients in Houston and LATAM"
        >
          Clear & Transparent Pricing
        </Heading>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
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
                onClick={() => handlePlanSelection(plan.id)}
                className={`mt-8 w-full text-sm font-inter p-3 rounded-md transition-all duration-200 ease-in-out hover:scale-105 ${
                  plan.featured
                    ? "bg-gold text-gray-900 hover:bg-gold/90"
                    : "text-white/80 hover:bg-gold/20 border border-gold/50"
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Payment Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gold/20">
              <h3 className="text-4xl font-bold text-gold mb-4 font-iceland">
                Complete Your Order
              </h3>

              <div className="mb-4 font-inter">
                <p className="text-white mb-2">
                  Selected Plan:{" "}
                  <span className="text-gold font-bold">
                    {pricingPlans.find((p) => p.id === selectedPlan)?.name}
                  </span>
                </p>
                <p className="text-white">
                  Price:{" "}
                  <span className="text-gold font-bold">
                    {pricingPlans.find((p) => p.id === selectedPlan)?.price}
                  </span>
                </p>
              </div>

              <div className="space-y-4 font-inter">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-gold focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-gold focus:outline-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6 font-inter">
                <button
                  onClick={handleCheckout}
                  disabled={isPending}
                  className="flex-1 bg-gold text-gray-900 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50"
                >
                  {isPending ? "Processing..." : "Proceed to Payment"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  disabled={isPending}
                  className="flex-1 border border-gold/50 text-gold py-3 rounded-lg hover:bg-gold/10 transition-colors"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center font-inter">
                You will be redirected to Stripe for secure payment
              </p>
            </div>
          </div>
        )}

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
