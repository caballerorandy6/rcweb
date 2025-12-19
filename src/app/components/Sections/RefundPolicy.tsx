"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Heading from "@/app/components/ui/Heading";
import {
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import useSectionObserver from "@/hooks/useSectionObserver";

const RefundPolicy = () => {
  const router = useRouter();
  const ref = useSectionObserver({ sectionName: "Refund Policy" });

  const handleGoBack = () => {
    router.back();
  };

  return (
    <section
      ref={ref}
      id="refund-policy"
      className="relative py-24 sm:py-32 overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-900"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-4 w-72 h-72 bg-gold/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Botón de regresar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="mb-8 max-w-5xl mx-auto flex justify-end"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              transition: { type: "spring", stiffness: 400, damping: 17 },
            }}
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
              At{" "}
              <span className="text-gold font-bold">RC Web Solutions LLC</span>,
              we stand behind the quality of our work. Our refund policy is
              designed to give you peace of mind when investing in our services
              while protecting the work we commit to your project.
            </p>
            <p className="mt-4 text-white/90 text-lg leading-relaxed font-inter">
              This policy was last updated on{" "}
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
              {/* Two-Payment Structure */}
              <section>
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  Two-Payment Project Structure
                </h2>
                <p className="text-white/80 leading-relaxed font-inter mb-4">
                  All projects at RC Web Solutions LLC are structured with a
                  two-payment system designed to protect both parties and ensure
                  commitment to project success:
                </p>
                <ul className="space-y-3 text-white/80 font-inter list-disc list-inside">
                  <li>
                    <strong className="text-gold">First Payment (50%):</strong>{" "}
                    Required to initiate the project and begin development work
                  </li>
                  <li>
                    <strong className="text-gold">Second Payment (50%):</strong>{" "}
                    Due upon project completion and delivery
                  </li>
                </ul>
                <p className="text-white/80 leading-relaxed font-inter mt-4">
                  Once the first payment is processed, your project begins
                  immediately and our team commences work on your
                  specifications.
                </p>
              </section>

              {/* NO Refunds Policy */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  NO Refunds After First Payment
                </h2>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-4">
                  <p className="text-white/90 font-semibold font-inter">
                    ⚠️ IMPORTANT: Once the first payment is processed, it
                    becomes immediately NON-REFUNDABLE.
                  </p>
                </div>

                <p className="text-white/80 leading-relaxed font-inter mb-4">
                  When you make the first payment, the project starts
                  immediately and our team begins investing time, resources, and
                  expertise into your project. This includes:
                </p>

                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside mb-4">
                  <li>Project planning and architecture design</li>
                  <li>Resource allocation and team assignment</li>
                  <li>Initial development and setup</li>
                  <li>Communication and project management</li>
                  <li>Time committed by our development team</li>
                </ul>

                <p className="text-white/80 leading-relaxed font-inter">
                  If you decide not to continue with the project after the first
                  payment has been made, no refund will be issued as we have
                  already invested significant time and resources into
                  initiating your project.
                </p>
              </section>

              {/* Cancellation Before Payment */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  Cancellation Before Payment
                </h2>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 mb-4">
                  <p className="text-white/90 font-semibold font-inter">
                    ✓ You may cancel your order at any time BEFORE making the
                    first payment with no penalty.
                  </p>
                </div>

                <p className="text-white/80 leading-relaxed font-inter">
                  We understand that circumstances change. If you need to cancel
                  before making your first payment, simply contact us and
                  we&apos;ll close your project request with no charges or
                  obligations. However, once the first payment is processed, the
                  no-refund policy takes effect immediately.
                </p>
              </section>

              {/* Non-Refundable Items */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  Non-Refundable Items
                </h2>
                <p className="text-white/80 leading-relaxed font-inter mb-3">
                  The following items and services are non-refundable under all
                  circumstances:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside">
                  <li>Custom development work and coding</li>
                  <li>
                    Design services and mockups created specifically for your
                    project
                  </li>
                  <li>
                    Third-party services purchased on your behalf (domain names,
                    hosting, licenses, etc.)
                  </li>
                  <li>Consultation hours and project planning time</li>
                  <li>
                    Any work performed or in progress at the time of
                    cancellation request
                  </li>
                  <li>Completed projects or delivered milestones</li>
                  <li>Monthly subscription payments for maintenance services</li>
                </ul>
              </section>

              {/* Subscription Services */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  Subscription Services (Monthly Maintenance)
                </h2>
                <p className="text-white/80 leading-relaxed font-inter mb-4">
                  The Monthly Website Maintenance and Support service operates
                  on a subscription basis with automatic recurring payments of
                  $200 USD per month.
                </p>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 mb-4">
                  <p className="text-white/90 font-semibold font-inter">
                    ⚠️ Subscription Refund Policy: No partial month refunds are
                    provided upon cancellation.
                  </p>
                </div>

                <ul className="space-y-3 text-white/80 font-inter list-disc list-inside">
                  <li>
                    <strong className="text-gold">Billing:</strong>{" "}
                    Your card will be charged $200 USD automatically on the same
                    day each month from your subscription start date
                  </li>
                  <li>
                    <strong className="text-gold">Cancellation:</strong>{" "}
                    You may cancel your subscription at any time by contacting us.
                    Cancellation takes effect at the end of your current billing period
                  </li>
                  <li>
                    <strong className="text-gold">No Prorated Refunds:</strong>{" "}
                    If you cancel mid-month, you will continue to receive service
                    until the end of your paid period, but no refund will be issued
                    for the remaining days
                  </li>
                  <li>
                    <strong className="text-gold">Failed Payments:</strong>{" "}
                    If a payment fails, we will attempt to charge your card again.
                    After multiple failed attempts, your subscription may be suspended
                  </li>
                </ul>
              </section>

              {/* Project Changes and Scope */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  Project Changes and Scope Modifications
                </h2>
                <p className="text-white/80 leading-relaxed font-inter mb-4">
                  We understand that project requirements may evolve.
                  Here&apos;s how we handle changes:
                </p>
                <ul className="space-y-3 text-white/80 font-inter list-disc list-inside">
                  <li>
                    <strong className="text-gold">Minor Adjustments:</strong>{" "}
                    Small tweaks and refinements within the original scope are
                    included at no extra charge
                  </li>
                  <li>
                    <strong className="text-gold">Scope Increases:</strong>{" "}
                    Significant additions or changes may require additional
                    payment, which will be quoted separately
                  </li>
                  <li>
                    <strong className="text-gold">Communication:</strong> All
                    changes will be discussed and agreed upon before
                    implementation
                  </li>
                </ul>
                <p className="text-white/80 leading-relaxed font-inter mt-4">
                  Note: Changes to project scope do not affect the
                  non-refundable status of the initial payment.
                </p>
              </section>

              {/* Quality Guarantee */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  Our Quality Guarantee
                </h2>
                <p className="text-white/80 leading-relaxed font-inter mb-4">
                  While we maintain a strict no-refund policy, we are committed
                  to your satisfaction:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside">
                  <li>
                    We work closely with you throughout the project to ensure it
                    meets your expectations
                  </li>
                  <li>
                    We provide regular updates and opportunities for feedback
                  </li>
                  <li>
                    We make revisions within the agreed scope to ensure
                    you&apos;re happy with the final product
                  </li>
                  <li>
                    We don&apos;t request the final payment until you approve
                    the completed work
                  </li>
                  <li>
                    Post-launch support is included to address any technical
                    issues
                  </li>
                </ul>
              </section>

              {/* Contact Before Starting */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  Questions? Contact Us First
                </h2>

                <div className="bg-gold/10 border border-gold/30 rounded-lg p-6 mb-4">
                  <p className="text-white/90 font-semibold font-inter mb-3">
                    If you have any questions or concerns about starting a
                    project, please contact us BEFORE making your first payment.
                  </p>
                  <p className="text-white/80 font-inter">
                    We&apos;re happy to discuss your project requirements,
                    timeline, deliverables, and address any concerns to ensure
                    you&apos;re completely comfortable before committing to the
                    project.
                  </p>
                </div>

                <div className="space-y-3 text-white/80 font-inter">
                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className="w-5 h-5 text-gold flex-shrink-0" />
                    <div>
                      <strong className="text-gold">Email:</strong>{" "}
                      <a
                        href="mailto:contactus@rcweb.dev"
                        className="hover:text-gold transition-colors underline"
                      >
                        contactus@rcweb.dev
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CurrencyDollarIcon className="w-5 h-5 text-gold flex-shrink-0" />
                    <div>
                      <strong className="text-gold">Phone:</strong>{" "}
                      <a
                        href="tel:+13463757534"
                        className="hover:text-gold transition-colors"
                      >
                        +1 346-375-7534
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* Dispute Resolution */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  Dispute Resolution
                </h2>
                <p className="text-white/80 leading-relaxed font-inter mb-4">
                  In the unlikely event of a dispute regarding our services or
                  this refund policy:
                </p>
                <ul className="space-y-2 text-white/80 font-inter list-disc list-inside">
                  <li>
                    We encourage open communication to resolve any issues
                    directly
                  </li>
                  <li>
                    Contact us immediately if you have concerns about the
                    project direction
                  </li>
                  <li>
                    We&apos;ll work collaboratively to find a solution that
                    addresses your needs
                  </li>
                  <li>
                    All disputes will be handled professionally and in good
                    faith
                  </li>
                </ul>
              </section>

              {/* Agreement */}
              <section className="pt-8 border-t border-gold/20">
                <h2 className="text-2xl font-bold text-gold font-iceland mb-4">
                  Your Agreement
                </h2>
                <p className="text-white/80 leading-relaxed font-inter">
                  By making a payment for our services, you acknowledge that you
                  have read, understood, and agree to this Refund Policy. You
                  understand that the first payment is non-refundable and that
                  work will begin immediately upon receipt of payment.
                </p>
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

        {/* Return to Pricing */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.2,
          }}
        >
          <button
            onClick={() => router.push("/#pricing")}
            className="text-white/50 hover:text-gold underline text-sm transition-colors font-inter"
          >
            Return to Pricing Plans
          </button>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          className="mt-4 text-center flex justify-center items-center"
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

export default RefundPolicy;
