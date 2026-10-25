import { CheckIcon } from "@heroicons/react/24/outline";
import type { Route } from "next";
import { offers, checkoutPlans, offerPriceParts } from "@/lib/data";
import Heading from "../ui/Heading";
import { formatCurrency } from "@/lib/utils";
import Button from "@/components/ui/Button";
import PlanCTA from "@/components/sections/PlanCTA";
import CheckoutModal from "@/components/sections/CheckoutModal";

/**
 * Cards render on the server; PlanCTA + CheckoutModal are the client islands.
 * An offer with a fixed-price entry (landing page, maintenance) opens the
 * checkout; the rest, and the larger scopes, go to /schedule for a quote.
 */
// Only what the modal shows; the full catalogue stays on the server
const modalPlans = checkoutPlans.map(({ id, name, priceInCents, mode }) => ({
  id,
  name,
  priceInCents,
  mode,
}));

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="relative isolate overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<CheckIcon />}
          text="Pricing in USD • Serving clients in the US and worldwide"
        >
          Clear & Transparent Pricing
        </Heading>

        <div className="mx-auto mt-16 flex flex-wrap justify-center gap-8">
          {offers.map((offer) => {
            const { prefix, amount } = offerPriceParts(offer);
            return (
              <div
                key={offer.id}
                className={`reveal relative flex flex-col rounded-2xl ${
                  offer.featured
                    ? "border-2 border-gold ring-2 ring-gold/20 scale-105"
                    : "border border-gold/20"
                } bg-gray-900/50 p-8 transition-colors duration-200 hover:border-gold/50 hover:bg-gold/5 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]`}
              >
                {offer.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-gold px-4 py-1 text-xs font-inter text-gray-900">
                      Most Popular
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-iceland text-white">
                    {offer.title}
                  </h3>
                  <p className="mt-4 flex items-baseline gap-x-2">
                    {prefix && (
                      <span className="text-sm font-inter text-white/60">
                        {prefix}
                      </span>
                    )}
                    <span className="text-4xl font-iceland text-gold">
                      {amount}
                    </span>
                    <span className="text-sm font-inter text-white/60">USD</span>
                  </p>
                  <p className="mt-2 text-sm font-inter text-gold/80">
                    {offer.range} • {offer.duration}
                  </p>
                  <p className="mt-4 text-sm sm:text-base font-inter text-white/80 leading-relaxed">
                    {offer.description}
                  </p>
                </div>

                <ul className="mt-8 space-y-3">
                  {offer.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon className="h-5 w-5 flex-none text-gold" />
                      <span className="text-sm font-inter text-white/80">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="mt-6 text-sm font-inter text-gold/70 italic">
                  {offer.ideal}
                </p>

                {/* Buttons sit at the bottom so cards in a row line up */}
                <div className="mt-auto pt-8 flex flex-col gap-3">
                  {offer.checkout && (
                    <PlanCTA planId={offer.checkout.id} featured={offer.featured}>
                      <span className="whitespace-nowrap">
                        {offer.checkout.cta}
                        {offer.checkout.mode === "payment" &&
                          ` · ${formatCurrency(offer.checkout.priceInCents, true)}`}
                      </span>
                    </PlanCTA>
                  )}
                  {offer.quoteCta && (
                    <Button
                      href={`/schedule?service=${offer.id}` as Route}
                      variant={
                        offer.featured && !offer.checkout ? "primary" : "secondary"
                      }
                      size="lg"
                      fullWidth
                    >
                      {offer.quoteCta}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <CheckoutModal plans={modalPlans} />

        <div className="mx-auto mt-10 max-w-lg text-center">
          <p className="text-sm font-inter text-white/50">
            All projects include: Source code • Domain & hosting setup •
            Training • 50% deposit, 50% on completion. The landing page and
            the maintenance plan can be paid right here; &ldquo;From&rdquo;
            prices are quoted after a short conversation, and the final price
            depends on the scope.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
