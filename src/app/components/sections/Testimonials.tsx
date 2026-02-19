"use client";

import useSectionObserver from "@/hooks/useSectionObserver";
import { StarIcon } from "@heroicons/react/24/solid";
import Heading from "../ui/Heading";
import { motion } from "framer-motion";
import { testimonials, GOOGLE_REVIEW_URL } from "@/lib/data";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

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
          text="Real results from successful projects"
        >
          What My Clients Say
        </Heading>

        <motion.div
          variants={containerVariants}
          initial={false}
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          style={{ opacity: 1 }}
          className="mx-auto mt-16 flex flex-wrap justify-center gap-6 lg:gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.author}
              variants={cardVariants}
              className="group relative rounded-2xl border border-gold/20 bg-gray-900/50 p-6 lg:p-8 backdrop-blur-sm transition-all duration-200 hover:border-gold/50 hover:bg-gold/5 hover:scale-105 shadow-lg shadow-black/20 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1.5rem)]"
            >
              {/* Google badge */}
              <div className="absolute top-4 right-4">
                <GoogleIcon />
              </div>

              <div className="flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={`star-${testimonial.author}-${i}`} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>

              <blockquote className="mt-6">
                <p className="text-sm sm:text-base font-inter text-white/80 leading-relaxed line-clamp-6">
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
                  {testimonial.company && (
                    <p className="text-xs font-inter text-gold/80">
                      {testimonial.company}
                    </p>
                  )}
                  <p className="text-xs font-inter text-white/60">
                    {testimonial.time}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Link to leave a review */}
        <div className="text-center mt-12">
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-inter font-semibold text-gold border-2 border-gold/50 hover:bg-gold/10 hover:border-gold/60 rounded-lg transition-all duration-200"
          >
            <GoogleIcon />
            Write a Review on Google
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
