"use client";

import { motion } from "framer-motion";

interface HeadingProps {
  children: React.ReactNode; // título
  icon: React.ReactNode; // ícono decorativo o informativo
  text: string; // descripción
}

const Heading = ({ children, icon, text }: HeadingProps) => {
  return (
    <motion.section
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ opacity: 1 }}
      className="mx-auto max-w-2xl text-center"
    >
      <div className="flex items-center justify-center gap-2">
        <span
          className="text-gold w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center"
          aria-hidden="true"
        >
          {icon}
        </span>

        <h1 className="text-2xl font-semibold text-gold font-iceland sm:text-3xl md:text-4xl lg:text-5xl">
          {children}
        </h1>
      </div>

      <p className="mt-6 text-base sm:text-lg font-inter text-white/80 leading-relaxed">{text}</p>
    </motion.section>
  );
};

export default Heading;
