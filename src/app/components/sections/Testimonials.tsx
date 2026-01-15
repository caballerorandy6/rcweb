"use client";

import useSectionObserver from "@/hooks/useSectionObserver";
import { StarIcon } from "@heroicons/react/24/solid";
import Heading from "../ui/Heading";
import { motion } from "framer-motion";
import { testimonials } from "@/lib/data";

const Testimonials = () => {
  const ref = useSectionObserver({ sectionName: "Testimonials" });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 20,
      },
    },
  };

  return (
    <section
      id="testimonials"
      ref={ref}
      className="relative isolate overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<StarIcon />}
          text=" Real results from successful projects"
        >
          What My Clients Say
        </Heading>

        <motion.div
          variants={containerVariants}
          initial={false}
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          style={{ opacity: 1 }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-3 lg:gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.author}
              variants={cardVariants}
              className="group relative rounded-2xl border border-gold/20 bg-gray-900/50 p-6 lg:p-8 backdrop-blur-sm transition-all duration-200 hover:border-gold/50 hover:bg-gold/5 hover:scale-105 shadow-lg shadow-black/20"
            >
              <div className="flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-gold" />
                ))}
              </div>

              <blockquote className="mt-6">
                <p className="text-sm sm:text-base font-inter text-white/80 italic leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>
              </blockquote>

              <div className="mt-8 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center">
                  <span className="text-lg font-iceland text-gold">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-iceland text-white">
                    {testimonial.author}
                  </p>
                  <p className="text-xs font-inter text-white/60">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gold/10">
                <span className="inline-flex items-center rounded-full bg-gold/10 px-3 py-1 text-xs font-inter text-gold">
                  {testimonial.project}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
