"use client";

import { useRouter } from "next/navigation";
import Heading from "@/app/components/Heading";
import {
  DocumentTextIcon,
  CalendarIcon,
  ArrowLeftIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import useSectionObserver from "@/hooks/useSectionObserver";
import { motion, Variants } from "framer-motion";

const refundSections = [
  {
    title: "30-Day Money Back Guarantee",
    content:
      "We offer a full refund within 30 days of your initial payment if you are not satisfied with our services. No questions asked.",
    icon: <CurrencyDollarIcon className="w-6 h-6" />,
    color: "from-green-500/10 to-green-600/10",
  },
  {
    title: "Eligibility Requirements",
    content:
      "To be eligible for a refund, you must request it within 30 days of your payment date. Refunds are only available for first-time purchases.",
    icon: <DocumentTextIcon className="w-6 h-6" />,
    color: "from-blue-500/10 to-blue-600/10",
  },
  {
    title: "Refund Process",
    content:
      "To request a refund, contact us at support@rcwebsolutionsllc.com with your order details. Refunds are processed within 5-10 business days.",
    icon: <CalendarIcon className="w-6 h-6" />,
    color: "from-purple-500/10 to-purple-600/10",
  },
  {
    title: "Non-Refundable Services",
    content:
      "Custom development work completed and delivered, third-party services purchased on your behalf, and domain registration fees are non-refundable.",
    icon: <DocumentTextIcon className="w-6 h-6" />,
    color: "from-amber-500/10 to-amber-600/10",
  },
];

const RefundPolicy = () => {
  const router = useRouter();
  const ref = useSectionObserver({ sectionName: "Refund Policy" });

  const handleGoBack = () => {
    router.back();
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  };

  return (
    <section
      ref={ref}
      id="refund-policy"
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Botón de regresar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="mb-8 max-w-4xl mx-auto flex justify-end"
        >
          <motion.button
            whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 17 } }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-600 font-inter"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Go Back
          </motion.button>
        </motion.div>

        <Heading
          icon={<CurrencyDollarIcon className="w-8 text-gold" />}
          text="Our Commitment to You"
        >
          Refund Policy
        </Heading>

        {/* Introducción */}
        <motion.div
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="bg-gradient-to-r from-gold/10 to-gold/5 backdrop-blur-lg rounded-2xl p-8 border border-gold/20 shadow-xl shadow-black/50">
            <p className="text-white/90 text-lg leading-relaxed font-inter text-center">
              At{" "}
              <span className="text-gold font-bold">RC Web Solutions LLC</span>,
              we stand behind the quality of our work. Our refund policy is
              designed to give you peace of mind when investing in our services.
            </p>
          </div>
        </motion.div>

        {/* Secciones de política */}
        <motion.div
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {refundSections.map((section, index) => (
            <motion.div
              key={index}
              variants={sectionVariants}
              className="group relative overflow-hidden bg-gray-900/60 backdrop-blur-md rounded-xl border border-gold/20 hover:border-gold/40 transition-all duration-300"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gold/10 rounded-lg text-gold group-hover:bg-gold/20 transition-colors">
                    {section.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gold font-iceland tracking-wide">
                    {section.title}
                  </h3>
                </div>
                <p className="text-gray-100 leading-relaxed text-sm font-inter">
                  {section.content}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Fecha de actualización */}
        <motion.div
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.4 }}
        >
          <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gold/10 p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-white/50 text-sm font-inter">
              <CalendarIcon className="w-4 h-4" />
              <span>Last updated: October 7, 2025</span>
            </div>
          </div>
        </motion.div>

        {/* Botón de descarga y contacto */}
        <motion.div
          className="mt-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a
              href="/refund-policy.pdf"
              download="RC-Web-Refund-Policy.pdf"
              whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 17 } }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-gray-900 font-bold rounded-lg hover:bg-gold/90 transition-colors font-inter"
            >
              <DocumentTextIcon className="w-5 h-5" />
              Download PDF
            </motion.a>
          </div>

          {/* Botón para volver al inicio */}
          <div className="mt-6 text-center font-inter">
            <button
              onClick={() => router.push("/#pricing")}
              className="text-white/50 hover:text-white underline text-sm transition-colors"
            >
              Return to Pricing Plans
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RefundPolicy;
