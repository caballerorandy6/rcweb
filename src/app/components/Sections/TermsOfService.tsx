"use client";

import Heading from "@/app/components/Heading";
import {
  DocumentTextIcon,
  ShieldCheckIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import useSectionObserver from "@/hooks/useSectionObserver";
import { motion, Variants } from "framer-motion";
import { sections } from "@/lib/data";

const TermsOfService = () => {
  const ref = useSectionObserver({ sectionName: "Terms of Service" });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const sectionVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      ref={ref}
      id="terms"
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<DocumentTextIcon className="w-8 text-gold" />}
          text="Legal Agreement"
        >
          Terms of Service
        </Heading>

        {/* Introduction Card */}
        <motion.div
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-gold/10 to-gold/5 backdrop-blur-lg rounded-2xl p-8 border border-gold/20 shadow-xl shadow-black/50">
            <p className="text-white/90 text-lg leading-relaxed font-inter text-center">
              Welcome to{" "}
              <span className="text-gold font-bold">RC Web Solutions LLC</span>.
              By accessing or using our services, you agree to be bound by these
              Terms of Service. Please read them carefully before engaging our
              services.
            </p>
          </div>
        </motion.div>

        {/* Terms Sections Grid */}
        <motion.div
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              variants={sectionVariants}
              className={`
                group relative overflow-hidden
                bg-gray-900/60 backdrop-blur-md 
                rounded-xl border border-gold/20 
                hover:border-gold/40 transition-all duration-300
                ${index === sections.length - 1 && sections.length % 2 !== 0 ? "md:col-span-2 md:max-w-2xl md:mx-auto" : ""}
              `}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="relative p-6">
                {/* Header with Icon */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gold/10 rounded-lg text-gold group-hover:bg-gold/20 transition-colors">
                    {section.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gold font-iceland tracking-wide">
                    {section.title}
                  </h3>
                </div>

                {/* Content */}
                <p className="text-gray-100 leading-relaxed text-sm font-inter">
                  {section.content}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Information */}
        <motion.div
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gold/10 p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-white/50 text-sm font-inter">
              <CalendarIcon className="w-4 h-4" />
              <span>Last updated: September 25, 2025</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gold/10 flex flex-col items-center">
              <p className="text-gold font-bold mb-2 font-iceland text-2xl">
                RC Web Solutions LLC
              </p>
              <p className="text-white/70 text-sm font-inter">
                6210 Newquay St, Houston, TX 77085
              </p>
              <p className="text-white/70 text-sm font-inter mt-1">
                <a
                  href="mailto:contactus@rcweb.dev"
                  className="text-gold hover:text-gold/80 transition-colors"
                >
                  contactus@rcweb.dev
                </a>
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-gray-900 font-bold rounded-lg hover:bg-gold/90 transition-colors font-inter"
            onClick={() => {
              // Guardar aceptación en localStorage
              localStorage.setItem("termsAccepted", new Date().toISOString());
              // Opcional: enviar a analytics o base de datos
              console.log("Terms accepted at:", new Date().toISOString());
              // Redirigir o mostrar notificación
              alert("Terms accepted successfully!");
            }}
          >
            <ShieldCheckIcon className="w-5 h-5" />I Accept These Terms
          </motion.button>

          <motion.a
            href="/terms-of-service.pdf"
            download="RC-Web-Terms-of-Service.pdf"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border-2 border-gold text-gold font-bold rounded-lg hover:bg-gold/10 transition-colors font-inter"
          >
            <DocumentTextIcon className="w-5 h-5" />
            Download PDF
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default TermsOfService;
