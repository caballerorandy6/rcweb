"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Heading from "@/app/components/ui/Heading";
import {
  DocumentTextIcon,
  ShieldCheckIcon,
  CalendarIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import useSectionObserver from "@/hooks/useSectionObserver";
import { createStripeCheckoutAction } from "@/actions/payments/createStripeCheckoutAction";

const TermsOfService = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ref = useSectionObserver({ sectionName: "Terms of Service" });
  const [isPending, startTransition] = useTransition();

  // Obtener datos de URL
  const planId = searchParams.get("planId");
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

        // Crear sesión de Stripe
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
          planId: planId || undefined,
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
        } else if (!result.success) {
          toast.error(result.error || "Failed to process");
        }
      } catch (error) {
        toast.dismiss();
        toast.error("An error occurred");
        console.error("Error in handleAcceptTerms:", error);
      }
    });
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <section
      ref={ref}
      id="terms"
      className="relative py-24 sm:py-32 overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-900"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-4 w-72 h-72 bg-gold/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Mensaje de advertencia y botón de regresar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="mb-8 max-w-5xl mx-auto"
        >
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="w-10 h-10 text-amber-500" />
              </div>
              <div className="flex-grow">
                <h2 className="text-amber-500 font-bold text-2xl mb-1 font-iceland">
                  Important: Review Required
                </h2>
                <p className="text-white/80 text-sm sm:text-base font-inter">
                  Please carefully review and accept our Terms of Service before
                  proceeding to payment. This legal agreement outlines the
                  conditions of our service.
                </p>
              </div>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 400, damping: 17 },
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoBack}
                className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-600 font-inter"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Go Back
              </motion.button>
            </div>
          </div>
        </motion.div>

        <Heading
          icon={<DocumentTextIcon className="w-8 text-gold" />}
          text="Legal Agreement"
        >
          Terms of Service
        </Heading>

        {/* Introduction Card */}
        <motion.div
          className="mt-16 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="bg-gradient-to-r from-gold/10 to-gold/5 backdrop-blur-lg rounded-2xl p-8 border border-gold/20 shadow-xl shadow-black/50">
            <p className="text-white/90 text-lg leading-relaxed font-inter">
              Welcome to{" "}
              <span className="text-gold font-bold">RC Web Solutions LLC</span>.
              By accessing or using our services, you agree to be bound by these
              Terms of Service. Please read them carefully.
            </p>
            <p className="mt-4 text-white/90 text-lg leading-relaxed font-inter">
              This agreement was last updated on{" "}
              <strong className="text-gold">October 21, 2025</strong>.
            </p>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="mt-12 max-w-5xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="prose prose-invert prose-gold max-w-none">
            <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gold/20 p-8 space-y-8">
              {/* Acceptance of Terms */}
              <section>
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-white/80 leading-relaxed font-inter mb-4">
                  By accessing and using RC Web Solutions LLC&apos;s services,
                  you accept and agree to be bound by the terms and provisions
                  of this agreement. If you do not agree to abide by the above,
                  please do not use this service.
                </p>
                <p className="text-white/80 leading-relaxed font-inter">
                  These Terms of Service constitute a legally binding agreement
                  between you (the &ldquo;Client&rdquo; or &ldquo;you&rdquo;)
                  and RC Web Solutions LLC (&ldquo;Company,&rdquo;
                  &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
                </p>
              </section>

              {/* Services Provided */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  2. Services Provided
                </h2>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  RC Web Solutions LLC provides professional web development,
                  design, and related digital services including but not limited
                  to:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside">
                  <li>Custom website design and development</li>
                  <li>E-commerce solutions</li>
                  <li>Web application development</li>
                  <li>Website maintenance and support</li>
                  <li>Digital marketing and SEO services</li>
                  <li>Hosting and domain management</li>
                  <li>Consultation and technical advisory services</li>
                </ul>
              </section>

              {/* Payment Terms */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  3. Payment Terms
                </h2>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  3.1 Two-Payment Structure
                </h3>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  All projects follow a two-payment structure:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside mb-4">
                  <li>
                    <strong className="text-gold">First Payment (50%):</strong>{" "}
                    Due before work begins to secure your project
                  </li>
                  <li>
                    <strong className="text-gold">Second Payment (50%):</strong>{" "}
                    Due upon project completion and before final delivery
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  3.2 Subscription Services (Recurring Payments)
                </h3>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  The Monthly Website Maintenance and Support service operates on a
                  subscription basis with automatic recurring payments:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside mb-4">
                  <li>
                    <strong className="text-gold">Monthly Fee:</strong>{" "}
                    $200 USD charged automatically each month
                  </li>
                  <li>
                    <strong className="text-gold">Billing Cycle:</strong>{" "}
                    Your card will be charged on the same day each month from your initial subscription date
                  </li>
                  <li>
                    <strong className="text-gold">Cancellation:</strong>{" "}
                    You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period
                  </li>
                  <li>
                    <strong className="text-gold">No Refunds:</strong>{" "}
                    Partial month refunds are not provided upon cancellation
                  </li>
                  <li>
                    <strong className="text-gold">How to Manage:</strong>{" "}
                    You can manage your subscription, update payment methods, or cancel at any time by visiting{" "}
                    <Link href={"/manage-subscription" as Route} className="text-gold hover:text-gold/80 underline">
                      rcweb.dev/manage-subscription
                    </Link>{" "}
                    or contacting us directly
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  3.3 Payment Methods
                </h3>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  We accept the following payment methods:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside">
                  <li>Credit/Debit Cards (via Stripe)</li>
                  <li>Bank Transfer (Zelle)</li>
                  <li>Other methods as agreed upon in writing</li>
                </ul>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  3.4 Late Payments
                </h3>
                <p className="text-white/80 leading-relaxed font-inter">
                  If payment is not received within 30 days of the due date, we
                  reserve the right to suspend work, remove the website from
                  hosting, or take other appropriate action to collect payment.
                </p>
              </section>

              {/* Refund Policy */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  4. Refund Policy
                </h2>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-4">
                  <p className="text-white/90 font-semibold font-inter">
                    The first payment (50%) is NON-REFUNDABLE once work has
                    commenced.
                  </p>
                </div>

                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  Please refer to our complete Refund Policy for details. Key
                  points include:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside">
                  <li>
                    Cancellation is allowed before the first payment without
                    penalty
                  </li>
                  <li>
                    After the first payment, no refunds will be issued as work
                    begins immediately
                  </li>
                  <li>
                    Custom development, design work, and third-party services
                    are non-refundable
                  </li>
                </ul>
              </section>

              {/* Client Responsibilities */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  5. Client Responsibilities
                </h2>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  To ensure successful project completion, the Client agrees to:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside">
                  <li>
                    Provide all necessary content, materials, and information in
                    a timely manner
                  </li>
                  <li>
                    Respond to requests for feedback and approval within 5
                    business days
                  </li>
                  <li>Provide accurate and complete project requirements</li>
                  <li>
                    Maintain appropriate access credentials for third-party
                    services when needed
                  </li>
                  <li>Review and approve deliverables in a timely manner</li>
                  <li>Make timely payments according to the agreed schedule</li>
                </ul>
              </section>

              {/* Project Scope and Changes */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  6. Project Scope and Changes
                </h2>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  6.1 Scope Definition
                </h3>
                <p className="text-white/80 leading-relaxed font-inter mb-4">
                  All projects include a defined scope of work agreed upon
                  before the first payment. This scope outlines deliverables,
                  features, timeline, and other project specifications.
                </p>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  6.2 Scope Changes
                </h3>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  Changes to the project scope may result in:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside">
                  <li>
                    Additional fees for expanded features or functionality
                  </li>
                  <li>Extended timelines to accommodate new requirements</li>
                  <li>New written agreement for significant changes</li>
                </ul>
              </section>

              {/* Intellectual Property */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  7. Intellectual Property Rights
                </h2>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  7.1 Client Content
                </h3>
                <p className="text-white/80 leading-relaxed font-inter mb-4">
                  You retain all rights to content, images, and materials you
                  provide to us. You grant us a license to use these materials
                  for the purpose of completing your project.
                </p>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  7.2 Completed Work
                </h3>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  Upon full payment, you will own the custom code and designs
                  created specifically for your project. However:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside">
                  <li>
                    Third-party libraries, frameworks, and tools remain under
                    their respective licenses
                  </li>
                  <li>
                    We retain the right to showcase the project in our portfolio
                    unless otherwise agreed
                  </li>
                  <li>
                    Reusable components and generic code patterns may be used in
                    future projects
                  </li>
                </ul>
              </section>

              {/* Warranties and Disclaimers */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  8. Warranties and Disclaimers
                </h2>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  8.1 Our Commitment
                </h3>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  We warrant that:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside mb-4">
                  <li>
                    Services will be performed with professional care and skill
                  </li>
                  <li>
                    Work will substantially conform to agreed specifications
                  </li>
                  <li>We have the right to provide the services offered</li>
                </ul>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  8.2 Disclaimers
                </h3>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  Except as expressly stated:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside">
                  <li>
                    Services are provided &ldquo;as is&rdquo; without warranties
                    of any kind
                  </li>
                  <li>
                    We do not guarantee specific results, rankings, or business
                    outcomes
                  </li>
                  <li>
                    We are not responsible for third-party service failures or
                    interruptions
                  </li>
                </ul>
              </section>

              {/* Limitation of Liability */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  9. Limitation of Liability
                </h2>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  To the maximum extent permitted by law:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside">
                  <li>
                    Our total liability shall not exceed the amount paid by you
                    for the specific service in question
                  </li>
                  <li>
                    We are not liable for indirect, incidental, special, or
                    consequential damages
                  </li>
                  <li>
                    We are not liable for lost profits, data, or business
                    opportunities
                  </li>
                  <li>
                    Claims must be brought within one year of the date the cause
                    of action arose
                  </li>
                </ul>
              </section>

              {/* Confidentiality */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  10. Confidentiality
                </h2>
                <p className="text-white/80 leading-relaxed font-inter mb-4">
                  We respect your privacy and will keep all client information
                  confidential. We will not share your proprietary information,
                  business strategies, or sensitive data with third parties
                  without your permission, except as required by law.
                </p>
                <p className="text-white/80 leading-relaxed font-inter">
                  Please refer to our Privacy Policy for details on how we
                  collect, use, and protect your personal information.
                </p>
              </section>

              {/* Support and Maintenance */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  11. Support and Maintenance
                </h2>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  11.1 Initial Support
                </h3>
                <p className="text-white/80 leading-relaxed font-inter mb-4">
                  We provide 30 days of post-launch support at no additional
                  cost to address technical issues and bugs related to our work.
                </p>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  11.2 Ongoing Maintenance
                </h3>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  Ongoing maintenance, updates, and support beyond the initial
                  30 days can be arranged through:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside">
                  <li>Monthly maintenance plans</li>
                  <li>Hourly support agreements</li>
                  <li>Project-based updates</li>
                </ul>
              </section>

              {/* Termination */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  12. Termination
                </h2>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  12.1 Termination by Client
                </h3>
                <p className="text-white/80 leading-relaxed font-inter mb-4">
                  You may terminate services at any time. However, payments
                  already made are non-refundable, and you will be billed for
                  work completed up to the termination date.
                </p>

                <h3 className="text-xl font-semibold text-gold/90 font-iceland mt-6 mb-3">
                  12.2 Termination by Company
                </h3>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  We reserve the right to terminate services if:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside">
                  <li>Payment is not received within 30 days of due date</li>
                  <li>Client provides false or misleading information</li>
                  <li>
                    Client requests services for illegal or unethical purposes
                  </li>
                  <li>Client breaches these Terms of Service</li>
                </ul>
              </section>

              {/* Governing Law */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  13. Governing Law and Jurisdiction
                </h2>
                <p className="text-white/80 leading-relaxed font-inter">
                  These Terms of Service shall be governed by and construed in
                  accordance with the laws of the State of Texas, United States,
                  without regard to its conflict of law provisions. Any disputes
                  arising from this agreement shall be resolved in the courts of
                  Houston, Texas.
                </p>
              </section>

              {/* Changes to Terms */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  14. Changes to Terms
                </h2>
                <p className="text-white/80 leading-relaxed font-inter">
                  We reserve the right to modify these Terms of Service at any
                  time. Changes will be effective immediately upon posting to
                  our website. Your continued use of our services after changes
                  are posted constitutes acceptance of the modified terms.
                </p>
              </section>

              {/* Contact Information */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  15. Contact Information
                </h2>
                <p className="text-white/80 leading-relaxed font-inter mb-4">
                  If you have any questions about these Terms of Service, please
                  contact us:
                </p>
                <div className="space-y-2 text-white/80 font-inter">
                  <p>
                    <strong className="text-gold">RC Web Solutions LLC</strong>
                  </p>
                  <p>6210 Newquay St, Houston, TX 77085</p>
                  <p>
                    Email:{" "}
                    <a
                      href="mailto:contactus@rcweb.dev"
                      className="text-gold hover:text-gold/80 underline"
                    >
                      contactus@rcweb.dev
                    </a>
                  </p>
                  <p>
                    Phone:{" "}
                    <a
                      href="tel:+13463757534"
                      className="text-gold hover:text-gold/80"
                    >
                      +1 346-375-7534
                    </a>
                  </p>
                  <p>
                    Website:{" "}
                    <a
                      href="https://rcweb.dev"
                      className="text-gold hover:text-gold/80"
                    >
                      rcweb.dev
                    </a>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </motion.div>

        {/* Date Information */}
        <motion.div
          className="mt-12 max-w-5xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="bg-gray-900/60 backdrop-blur-md rounded-xl border border-gold/10 p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-white/50 text-sm font-inter">
              <CalendarIcon className="w-4 h-4" />
              <span>Last updated: October 21, 2025</span>
            </div>
          </div>
        </motion.div>

        {/* Accept Terms Button */}
        <motion.div
          className="mt-12 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.2,
          }}
        >
          {/* Mensaje de recordatorio antes de aceptar */}
          <div className="text-center mb-6 font-inter flex flex-col items-center">
            <p className="text-white/70 text-sm">
              By clicking &quot;I Accept These Terms&quot;, you confirm that you
              have read, understood, and agree to be bound by these Terms of
              Service.
            </p>
          </div>

          {/* Botón de aceptar */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 400, damping: 17 },
              }}
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center gap-2 px-8 py-3 bg-gold text-gray-900 font-bold rounded-lg hover:bg-gold/90 transition-colors font-inter ${
                isPending ? "opacity-70 cursor-wait" : ""
              }`}
              onClick={handleAcceptTerms}
              disabled={isPending}
            >
              <ShieldCheckIcon className="w-5 h-5" />
              {isPending ? "Processing..." : "I Accept These Terms"}
            </motion.button>
          </div>

          {/* Botón para volver al inicio */}
          <div className="mt-6 text-center font-inter">
            <button
              onClick={() => router.push("/#pricing")}
              className="text-white/50 hover:text-gold underline text-sm transition-colors"
            >
              Return to Pricing Plans
            </button>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          className="mt-8 text-center flex justify-center items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.3,
          }}
        >
          <p className="text-white/50 text-sm font-inter">
            RC Web Solutions LLC - Houston, TX 77085
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TermsOfService;
