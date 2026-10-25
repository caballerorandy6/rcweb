import type { Offer } from "@/lib/data";

/**
 * schema.org Offer for a catalogue entry. A one-time offer carries its
 * starting price; the monthly plan uses a UnitPriceSpecification so the
 * price reads as "$200 per month", not a one-off $200.
 */
export function offerToSchemaOffer(offer: Offer) {
  const price = (offer.priceFromCents / 100).toString();

  if (offer.checkout?.mode === "subscription") {
    return {
      "@type": "Offer",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price,
        priceCurrency: "USD",
        billingDuration: 1,
        billingIncrement: 1,
        unitCode: "MON",
      },
    };
  }

  return {
    "@type": "Offer",
    price,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  };
}
