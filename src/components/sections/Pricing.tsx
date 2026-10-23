import { CheckIcon } from "@heroicons/react/24/outline";
import { pricingPlans } from "@/lib/data";
import Heading from "../ui/Heading";
import Button from "@/components/ui/Button";
import PlanCTA from "@/components/sections/PlanCTA";
import CheckoutModal from "@/components/sections/CheckoutModal";

/**
 * Cards render on the server; PlanCTA + CheckoutModal are the client islands.
 * Only fixed-scope plans open the checkout; the rest link to a free call.
 */
// Only what the modal shows; the full catalogue stays on the server
const checkoutPlans = pricingPlans
  .filter((plan) => plan.purchasable)
  .map(({ id, name, priceInCents }) => ({ id, name, priceInCents }));

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
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`reveal relative rounded-2xl ${
                plan.featured
                  ? "border-2 border-gold ring-2 ring-gold/20 scale-105"
                  : "border border-gold/20"
              } bg-gray-900/50 p-8 transition-colors duration-200 hover:border-gold/50 hover:bg-gold/5 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]`}
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
                  {!plan.purchasable && (
                    <span className="text-sm font-inter text-white/60">
                      From
                    </span>
                  )}
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

              {plan.purchasable ? (
                <PlanCTA planId={plan.id} featured={plan.featured}>
                  {plan.cta}
                </PlanCTA>
              ) : (
                <Button
                  href="/schedule"
                  variant={plan.featured ? "primary" : "secondary"}
                  size="lg"
                  fullWidth
                  className="mt-8"
                >
                  {plan.cta}
                </Button>
              )}
            </div>
          ))}
        </div>

        <CheckoutModal plans={checkoutPlans} />

        <div className="mx-auto mt-10 max-w-2xl text-center">
          <p className="text-sm font-inter text-white/50">
            All projects include: Source code • Domain & hosting setup •
            Training • 50% deposit, 50% on completion. &ldquo;From&rdquo;
            prices are quoted after a free call; the final price depends on
            the scope.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
