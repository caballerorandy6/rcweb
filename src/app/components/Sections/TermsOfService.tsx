"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Heading from "@/app/components/Heading";
import {
  DocumentTextIcon,
  ShieldCheckIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import useSectionObserver from "@/hooks/useSectionObserver";
import { motion, Variants } from "framer-motion";
import { sections } from "@/lib/data";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { createStripeCheckoutAction } from "@/actions/createStripeCheckoutAction";

const TermsOfService = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ref = useSectionObserver({ sectionName: "Terms of Service" });
  const [isPending, startTransition] = useTransition();

  // Obtener datos de URL
  const planName = searchParams.get("planName");
  const planPrice = searchParams.get("planPrice");
  const planDescription = searchParams.get("planDescription");
  const customerEmail = searchParams.get("customerEmail");
  const customerName = searchParams.get("customerName");

  const handleAcceptTerms = () => {
    if (!planName || !planPrice || !customerEmail || !customerName) {
      toast.error("Missing information. Please start from pricing.");
      router.push("/#pricing");
      return;
    }

    startTransition(async () => {
      try {
        toast.loading("Processing...");

        // Registrar timestamp de aceptación
        const termsAcceptedAt = new Date().toISOString();

        // Crear sesión de Stripe (NO crear Payment aún)
        const result = await createStripeCheckoutAction({
          plan: {
            name: planName,
            price: parseInt(planPrice),
            description: planDescription || planName,
          },
          customer: {
            email: customerEmail,
            name: customerName,
          },
          termsAcceptedAt,
        });

        toast.dismiss();

        if (result.success && result.sessionUrl) {
          toast.success("Redirecting to secure payment...");

          // Guardar projectCode temporalmente
          if (result.projectCode) {
            sessionStorage.setItem("tempProjectCode", result.projectCode);
          }

          // Redirigir a Stripe
          window.location.href = result.sessionUrl;
        } else {
          toast.error(result.error || "Failed to process");
        }
      } catch (error) {
        toast.dismiss();
        toast.error("An error occurred");
        console.error("Error in handleAcceptTerms:", error);
      }
    });
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
      transition: { duration: 0.6, ease: "easeOut" },
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

        {/* Contenido legal */}
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
              Terms of Service. Please read them carefully.
            </p>
          </div>
        </motion.div>

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
          </div>
        </motion.div>

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
            className={`inline-flex items-center gap-2 px-8 py-3 bg-gold text-gray-900 font-bold rounded-lg hover:bg-gold/90 transition-colors font-inter ${isPending ? "opacity-70 cursor-wait" : ""}`}
            onClick={handleAcceptTerms}
            disabled={isPending}
          >
            <ShieldCheckIcon className="w-5 h-5" />
            {isPending ? "Processing…" : <>I Accept These Terms</>}
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
