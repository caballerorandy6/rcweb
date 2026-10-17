import type { Route } from "next";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { services } from "@/lib/data";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";

const FEATURED_SLUGS = [
  "web-design-houston",
  "bilingual-websites-houston",
  "ecommerce-houston",
];

// Server Component: cards are in the HTML; reveal-on-scroll is CSS only
const Services = () => {
  // Show only the 3 most commercial services
  const featuredServices = services.filter(
    (s) => "slug" in s && FEATURED_SLUGS.includes(s.slug as string)
  );

  // Fallback to first 3 if no slug match (keeps backward compatibility)
  const displayServices =
    featuredServices.length > 0 ? featuredServices : services.slice(0, 3);

  return (
    <section
      id="services"
      className="relative isolate overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-24 bg-gray-900"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<Cog6ToothIcon className="w-8 text-gold" />}
          text="Transform ideas into high-performance web applications that drive your business forward"
        >
          How I Can Help You
        </Heading>

        <ul className="mx-auto mt-16 flex flex-wrap justify-center gap-6 lg:gap-8">
          {displayServices.map((service) => (
            <li
              key={service.title}
              className="reveal group relative flex flex-col gap-6 rounded-2xl border border-gold/20 bg-gray-900/50 p-6 lg:p-8 backdrop-blur-xs transition-all duration-200 hover:scale-105 hover:border-gold/50 hover:bg-gold/5 shadow-lg shadow-black/20 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1.5rem)]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 ring-1 ring-gold/30">
                  <service.icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="text-xl font-iceland text-white">
                  {service.title}
                </h3>
              </div>

              <p className="text-sm sm:text-base font-inter text-white/80 leading-relaxed">
                {service.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {service.features.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center rounded-full bg-gold/10 px-3 py-1 text-xs font-inter text-gold ring-1 ring-inset ring-gold/20"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-gold/10">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-inter text-gold/80 italic">
                    {service.highlight}
                  </p>
                  <p className="text-sm font-inter font-semibold text-gold">
                    {service.price}
                  </p>
                </div>
              </div>

              <Button
                href={"#pricing" as Route}
                variant="secondary"
                className="mt-4 w-full sm:w-auto"
              >
                Get Quote
                <span aria-hidden="true">→</span>
              </Button>
            </li>
          ))}
        </ul>

        {/* View All Services */}
        <div className="mt-12 text-center">
          <Button href={"/services" as Route} variant="secondary" size="lg">
            View All Services
            <span aria-hidden="true">→</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
