"use client";

import useSectionObserver from "@/hooks/useSectionObserver";
import { StarIcon } from "@heroicons/react/24/solid";
//import Image from "next/image";

const testimonials = [
  {
    content:
      "Randy transformed our business idea into a functional platform. The real-time booking system he developed increased our conversions by 40%. Professional and always available.",
    author: "Michael Rodriguez",
    role: "CEO, Limo Renting Houston",
    image: "/testimonials/client1.jpg", // Placeholder
    rating: 5,
    project: "Booking Platform",
  },
  {
    content:
      "The admin dashboard Randy created saved us 15 hours per week in management. The bulk email feature was exactly what we needed. Excellent work.",
    author: "Sarah Johnson",
    role: "Manager, GSM AC Services",
    image: "/testimonials/client2.jpg", // Placeholder
    rating: 5,
    project: "Management System",
  },
  {
    content:
      "Working with Randy was excellent. He not only developed our site but also advised us on digital strategy. Our organic traffic grew 60% in 3 months.",
    author: "Carlos Mendez",
    role: "Professional Photographer",
    image: "/testimonials/client3.jpg", // Placeholder
    rating: 5,
    project: "Portfolio + Marketing",
  },
];

const Testimonials = () => {
  const ref = useSectionObserver({ sectionName: "Testimonials" });

  return (
    <section
      id="testimonials"
      ref={ref}
      className="relative isolate overflow-hidden py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-iceland tracking-tight text-gold sm:text-6xl">
            What My Clients Say
          </h2>
          <p className="mt-6 text-lg font-inter text-white/80">
            Real results from successful projects in Houston
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-gold/20 bg-gray-950/50 p-8 backdrop-blur-sm transition-all duration-200 hover:border-gold/50 hover:bg-gold/5"
            >
              {/* Rating Stars */}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
