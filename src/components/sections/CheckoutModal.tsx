"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import { pricingPlans } from "@/lib/data";
import { saveCheckoutCustomer } from "@/lib/checkoutCustomer";
import { useCheckoutStore } from "@/store/checkout-store";

/** Name + email before the terms page; opened by PlanCTA through the store */
export default function CheckoutModal() {
  const planId = useCheckoutStore((state) => state.planId);
  const close = useCheckoutStore((state) => state.close);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const plan = pricingPlans.find((p) => p.id === planId);
  if (!plan?.purchasable) return null;

  const isMonthly = plan.id === "website-maintenance";
  const amount = (plan.priceInCents * (isMonthly ? 1 : 0.5)) / 100;

  const handleGoToTerms = () => {
    if (!customerEmail || !customerName) {
      toast.error("Please fill in all fields");
      return;
    }

    // Nombre y email se guardan en sessionStorage; la URL solo lleva el ID del plan.
    startTransition(() => {
      saveCheckoutCustomer({
        name: customerName.trim(),
        email: customerEmail.trim(),
      });
      router.push(`/terms-of-service?plan=${encodeURIComponent(plan.id)}`);
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in"
    >
      <div className="bg-gray-900/95 rounded-2xl p-8 max-w-md w-full border border-gold/20 shadow-2xl shadow-gold/10 animate-enter">
        <h2
          id="checkout-title"
          className="text-4xl text-gold mb-6 font-iceland"
        >
          Complete Your Order
        </h2>

        <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gold/10 font-inter">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400 text-sm">Selected Plan:</span>
            <span className="text-gold font-bold">{plan.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">
              {isMonthly ? "Monthly Payment:" : "Initial Payment (50%):"}
            </span>
            <span className="text-2xl font-bold text-gold">
              ${amount.toFixed(2)}
              {isMonthly && (
                <span className="text-sm font-normal text-gold/70">/month</span>
              )}
            </span>
          </div>
        </div>

        <div className="space-y-4 font-inter">
          <div>
            <label
              htmlFor="checkout-name"
              className="block text-sm text-gray-300 mb-2 font-medium"
            >
              Your Name
            </label>
            <input
              id="checkout-name"
              type="text"
              autoComplete="name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-3 bg-gray-800/70 text-white rounded-lg border border-gray-700 focus:border-gold focus:outline-hidden focus:ring-2 focus:ring-gold/20 transition-all"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label
              htmlFor="checkout-email"
              className="block text-sm text-gray-300 mb-2 font-medium"
            >
              Email Address
            </label>
            <input
              id="checkout-email"
              type="email"
              autoComplete="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full p-3 bg-gray-800/70 text-white rounded-lg border border-gray-700 focus:border-gold focus:outline-hidden focus:ring-2 focus:ring-gold/20 transition-all"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6 font-inter">
          <Button
            size="lg"
            className="flex-1"
            onClick={handleGoToTerms}
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Go to Terms & Pay"}
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={close}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
