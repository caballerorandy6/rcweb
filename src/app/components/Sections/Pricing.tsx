"use client";

import { useState, useTransition } from "react";
import useSectionObserver from "@/hooks/useSectionObserver";
import { CheckIcon } from "@heroicons/react/24/outline";
import { pricingPlans } from "@/lib/data";
import Heading from "../Heading";
import { motion } from "framer-motion";
import { createInitialPaymentSessionAction } from "@/actions/createInitialPaymentSessionAction";
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

    // Abre la pestaña de inmediato (vacía o con loader)
    const stripeTab = window.open("", "_blank");

    if (!stripeTab) {
      toast.error(
        "Popup blocked! Please allow popups to continue to checkout."
      );
      return;
    }

    startTransition(async () => {
      const result = await createInitialPaymentSessionAction(
        {
          name: plan.name,
          price: plan.priceInCents,
          description: plan.description,
        },
        { email: customerEmail, name: customerName }
      );

      if (result.success && result.sessionUrl) {
        if (result.projectCode) {
          sessionStorage.setItem("projectCode", result.projectCode);
        }
        // Redirige a Stripe Checkout
        stripeTab.location.href = result.sessionUrl;

        // CERRAR MODAL y limpiar campos
        setShowModal(false);
        setCustomerEmail("");
        setCustomerName("");
        setSelectedPlan(null);

        // Mostrar mensaje de éxito
        toast.success("Redirecting to secure payment...");
      } else {
        toast.error(result.error || "Failed to create checkout session");
        //  Si falla, cierra la pestaña
        stripeTab.close();
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900/95 rounded-2xl p-8 max-w-md w-full border border-gold/20 shadow-2xl shadow-gold/10"
            >
              <h3 className="text-4xl font-bold text-gold mb-6 font-iceland">
                Complete Your Order
              </h3>

              {/* Información del plan con mejor diseño */}
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gold/10 font-inter">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Selected Plan:</span>
                  <span className="text-gold font-bold">
                    {pricingPlans.find((p) => p.id === selectedPlan)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">
                    Initial Payment (50%):
                  </span>
                  <span className="text-2xl font-bold text-gold">
                    $
                    {(
                      ((pricingPlans.find((p) => p.id === selectedPlan)
                        ?.priceInCents || 0) *
                        0.5) /
                      100
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-xs text-gray-500">
                    Final payment (50%) due upon project completion
                  </p>
                </div>
              </div>

              {/* Campos del formulario */}
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

              {/* Botones mejorados */}
              <div className="flex gap-4 mt-6 font-inter">
                <button
                  onClick={handleCheckout}
                  disabled={isPending}
                  className="flex-1 bg-gradient-to-r from-gold to-yellow-500 text-gray-900 py-3 rounded-lg font-semibold hover:from-gold/90 hover:to-yellow-500/90 transition-all disabled:opacity-50 shadow-lg shadow-gold/20"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-900"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Proceed to Payment"
                  )}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  disabled={isPending}
                  className="flex-1 border border-gold/50 text-gold py-3 rounded-lg hover:bg-gold/10 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>

              {/* Información adicional con iconos */}
              <div className="mt-6 pt-4 border-t border-gray-800 font-inter">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Secure Payment
                  </div>
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path
                        fillRule="evenodd"
                        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Powered by Stripe
                  </div>
                </div>
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
