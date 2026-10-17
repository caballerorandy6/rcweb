import { BookOpenIcon } from "@heroicons/react/24/outline";
import LeadMagnetCta from "@/components/sections/LeadMagnetCta";

const STATS = [
  { value: "8+", label: "Chapters" },
  { value: "100%", label: "Free" },
  { value: "PDF", label: "Format" },
];

// Server Component: the banner is in the HTML (it used to be invisible until
// a whileInView animation ran); only the tracked CTA is a client island
const LeadMagnetBanner = () => {
  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-r from-gold/10 via-transparent to-gold/10" />

      {/* Glow: pulse only when the user is fine with motion */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-gold/20 rounded-full blur-[100px] motion-safe:animate-pulse" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="reveal relative bg-gray-900/80 backdrop-blur-xl border border-gold/30 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-black/50">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Icon/Visual */}
            <div className="shrink-0">
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-linear-to-br from-gold via-gold-light to-gold flex items-center justify-center shadow-lg shadow-gold/30">
                  <BookOpenIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-900" />
                </div>
                {/* Free badge */}
                <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg font-inter uppercase tracking-wide">
                  Free
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-iceland mb-3">
                Get Your Free{" "}
                <span className="text-gold">Web Development Guide</span>
              </h2>

              <p className="text-white/70 font-inter text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
                Learn SEO fundamentals, security best practices, and
                cost-effective strategies to grow your online presence.
              </p>
            </div>

            {/* CTA Button */}
            <div className="shrink-0">
              <LeadMagnetCta />
            </div>
          </div>

          {/* Stats/Trust indicators */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-10">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-gold font-iceland">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-white/50 font-inter">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnetBanner;
