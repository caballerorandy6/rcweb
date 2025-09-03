"use client";

import useSectionObserver from "@/hooks/useSectionObserver";
import { StarIcon } from "@heroicons/react/24/solid";
import Heading from "../Heading";
import { motion } from "framer-motion";

const testimonials = [
  {
    content:
      "Randy transformed our business idea into a functional platform. The real-time booking system he developed increased our conversions by 40%. Professional and always available.",
    author: "Michael Rodriguez",
    role: "CEO, Limo Renting Houston",
    image: "/testimonials/client1.jpg",
    rating: 5,
    project: "Booking Platform",
  },
  {
    content:
      "The admin dashboard Randy created saved us 15 hours per week in management. The bulk email feature was exactly what we needed. Excellent work.",
    author: "Sarah Johnson",
    role: "Manager, GSM AC Services",
    image: "/testimonials/client2.jpg",
    rating: 5,
    project: "Management System",
  },
  {
    content:
      "Working with Randy was excellent. He not only developed our site but also advised us on digital strategy. Our organic traffic grew 60% in 3 months.",
    author: "Carlos Mendez",
    role: "Professional Photographer",
    image: "/testimonials/client3.jpg",
    rating: 5,
    project: "Portfolio + Marketing",
  },
];

const Testimonials = () => {
  const ref = useSectionObserver({ sectionName: "Testimonials" });

  // 2. Definir las variantes para el contenedor y las tarjetas
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Cada tarjeta se anima 0.2s después de la anterior
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.98 }, // Estado inicial: invisible, abajo y ligeramente más pequeño
    show: { opacity: 1, y: 0, scale: 1 }, // Estado final: visible y en su posición original
  };

  return (
    <section
      id="testimonials"
      ref={ref}
      className="relative isolate overflow-hidden pt-24 sm:pt-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<StarIcon />}
          text=" Real results from successful projects"
        >
          What My Clients Say
        </Heading>

        {/* 3. Aplicar motion al contenedor de la grilla */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative rounded-2xl border border-gold/20 bg-gray-950/50 p-8 backdrop-blur-sm transition-all duration-200 hover:border-gold/50 hover:bg-gold/5"
            >
              <div className="flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-gold" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mt-6">
                <p className="text-base font-inter text-white/70 italic">
                  &quot;{testimonial.content}&quot;
                </p>
              </blockquote>

              {/* Author */}
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
                  <p className="text-xs font-inter text-white/50">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              {/* Project Badge */}
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
