"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { saveCheckoutCustomer } from "@/lib/checkoutCustomer";
import { useCheckoutStore } from "@/store/checkout-store";
import { formatDollars } from "@/lib/utils";

const inputClasses =
  "w-full p-3 bg-gray-800/70 text-white rounded-xl border border-gray-700 placeholder:text-white/40 focus:border-gold focus:outline-hidden focus:ring-2 focus:ring-gold/20 aria-invalid:border-red-500/70 transition";

export interface CheckoutPlan {
  id: string;
  name: string;
  priceInCents: number;
}

/** Name + email before the terms page; opened by PlanCTA through the store */
export default function CheckoutModal({ plans }: { plans: CheckoutPlan[] }) {
  const planId = useCheckoutStore((state) => state.planId);
  const close = useCheckoutStore((state) => state.close);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [isPending, startTransition] = useTransition();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const plan = plans.find((p) => p.id === planId);
  const isOpen = Boolean(plan);

  const isMonthly = plan?.id === "website-maintenance";
  const amount = plan ? (plan.priceInCents * (isMonthly ? 1 : 0.5)) / 100 : 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!plan) return;

    const name = customerName.trim();
    const email = customerEmail.trim();
    const nextErrors: typeof errors = {};
    if (name.length < 2) nextErrors.name = "Enter your name so I know who to contact.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      nextErrors.email = "Enter a valid email so I can send your invoice.";
    setErrors(nextErrors);

    if (nextErrors.name) return nameRef.current?.focus();
    if (nextErrors.email) return emailRef.current?.focus();

    // Nombre y email se guardan en sessionStorage; la URL solo lleva el ID del plan.
    startTransition(() => {
      saveCheckoutCustomer({ name, email });
      router.push(`/terms-of-service?plan=${encodeURIComponent(plan.id)}`);
    });
  };

  // The native dialog traps focus, closes on Escape and returns focus to the
  // pricing button; the initial focus goes to the first field.
  return (
    <Modal
      open={isOpen}
      onClose={close}
      preventClose={isPending}
      initialFocus={nameRef}
      aria-labelledby="checkout-title"
      className="m-auto w-[calc(100%-2rem)] max-w-md max-h-[calc(100dvh-2rem)] bg-transparent p-0 text-inherit backdrop:bg-black/70 backdrop:backdrop-blur-xs backdrop:animate-fade-in"
    >
      <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain bg-gray-900/95 rounded-2xl p-8 border border-gold/20 shadow-2xl shadow-gold/10 animate-enter">
          {plan ? (
            <form onSubmit={handleSubmit} noValidate>
              <h2 id="checkout-title" className="text-4xl text-gold mb-6 font-iceland">
                Complete Your Order
              </h2>

              <dl className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gold/10 font-inter">
                <div className="flex justify-between items-center mb-2">
                  <dt className="text-gray-400 text-sm">Selected plan</dt>
                  <dd className="text-gold font-semibold">{plan.name}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-gray-400 text-sm">
                    {isMonthly ? "Monthly payment" : "Initial payment (50%)"}
                  </dt>
                  <dd className="text-2xl font-semibold text-gold tabular-nums">
                    {formatDollars(amount)}
                    {isMonthly ? (
                      <span className="text-sm font-normal text-gold/70">/month</span>
                    ) : null}
                  </dd>
                </div>
              </dl>

              <div className="space-y-4 font-inter">
                <div>
                  <label
                    htmlFor="checkout-name"
                    className="block text-sm text-gray-300 mb-2 font-medium"
                  >
                    Your name
                  </label>
                  <input
                    ref={nameRef}
                    id="checkout-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    aria-required="true"
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? "checkout-name-error" : undefined}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={inputClasses}
                    placeholder="Maria Lopez…"
                  />
                  {errors.name ? (
                    <p id="checkout-name-error" role="alert" className="mt-2 text-sm text-red-400">
                      {errors.name}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label
                    htmlFor="checkout-email"
                    className="block text-sm text-gray-300 mb-2 font-medium"
                  >
                    Email address
                  </label>
                  <input
                    ref={emailRef}
                    id="checkout-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    spellCheck={false}
                    required
                    aria-required="true"
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? "checkout-email-error" : undefined}
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className={inputClasses}
                    placeholder="maria@yourbusiness.com…"
                  />
                  {errors.email ? (
                    <p id="checkout-email-error" role="alert" className="mt-2 text-sm text-red-400">
                      {errors.email}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex gap-4 mt-6 font-inter">
                <Button type="submit" size="lg" className="flex-auto" disabled={isPending}>
                  {isPending ? "Loading…" : "Go to Terms & Pay"}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="flex-none px-8"
                  onClick={close}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : null}
      </div>
    </Modal>
  );
}
