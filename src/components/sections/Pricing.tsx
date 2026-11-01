import { CheckIcon } from "@heroicons/react/24/outline";
import { getTranslations } from "next-intl/server";
import { offerPriceParts } from "@/lib/data";
import { getLocalizedCatalog } from "@/lib/catalog";
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
const Pricing = async () => {
  const [t, { offers, priceLabels }] = await Promise.all([
    getTranslations("Home.pricing"),
    getLocalizedCatalog(),
  ]);

  // Only what the modal shows (the offer title in the visitor's language);
  // the full catalogue stays on the server
  const modalPlans = offers.flatMap((offer) =>
    offer.checkout
      ? [{ id: offer.checkout.id, name: offer.title, priceInCents: offer.checkout.priceInCents, mode: offer.checkout.mode }]
      : []
  );

  return (
    <section
      id="pricing"
      className="relative isolate overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<CheckIcon />}
          text={t("subheading")}
        >
          {t("heading")}
        </Heading>

        <div className="mx-auto mt-16 flex flex-wrap justify-center gap-8">
          {offers.map((offer) => {
            const { prefix, amount } = offerPriceParts(offer, priceLabels);
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
                      {t("mostPopular")}
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
                    <span className="text-sm font-inter text-white/60">{t("usd")}</span>
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
                      href={{ pathname: "/schedule", query: { service: offer.id } }}
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
          <p className="text-sm font-inter text-white/50">{t("note")}</p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
