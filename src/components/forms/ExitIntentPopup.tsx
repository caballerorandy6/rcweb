"use client";

import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon, GiftIcon } from "@heroicons/react/24/outline";
import { useExitIntent } from "@/hooks/useExitIntent";
import { toast } from "sonner";
import { downloadGuideAction } from "@/actions/campaigns/downloadGuideAction";
import { trackFBLead } from "@/components/tracking/FacebookPixel";
import { trackLinkedInConversion } from "@/components/tracking/LinkedInInsightTag";
import { trackSubmitLeadForm } from "@/lib/analytics";

export default function ExitIntentPopup() {
  const { showPopup, closePopup } = useExitIntent({
    delayMs: 10000, // Wait 10 seconds before enabling
    cookieExpiryDays: 3, // Show again after 3 days
  });

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Trigger PDF download
      const link = document.createElement("a");
      link.href = "/web-development-guide.pdf";
      link.download = "RC-Web-Development-Guide.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Save email and send guide via email
      const result = await downloadGuideAction(email);

      if (result.success) {
        // Track conversions
        trackFBLead();
        trackLinkedInConversion();
        trackSubmitLeadForm(email);

        toast.success("Guide downloaded! Check your email too.");
        closePopup();
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Exit intent error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={showPopup} onClose={closePopup} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border-2 border-gold/30 shadow-2xl shadow-gold/10 transition-all data-closed:scale-95 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
          >
            {/* Close button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
              aria-label="Close popup"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {/* Content */}
            <div className="p-8">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
                  <GiftIcon className="w-8 h-8 text-gold" />
                </div>
              </div>

              {/* Headline */}
              <h2 className="text-2xl md:text-3xl font-bold text-center text-white font-iceland mb-3">
                Wait! Don&apos;t Leave Empty-Handed
              </h2>

              <p className="text-gray-300 text-center font-inter mb-6">
                Get our <span className="text-gold font-semibold">FREE Web Development Guide</span> with
                expert tips to grow your business online.
              </p>

              {/* Benefits */}
              <ul className="space-y-2 mb-6">
                {[
                  "How to choose the right web approach",
                  "SEO fundamentals that work",
                  "Cost-effective development strategies",
                ].map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-center gap-2 text-gray-300 text-sm font-inter"
                  >
                    <span className="text-gold">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full p-4 bg-gray-800/80 text-white rounded-xl border border-gray-700/60 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all font-inter placeholder-gray-400"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full py-4 text-lg font-semibold text-black bg-gradient-to-r from-gold via-yellow-200 to-gold hover:from-yellow-200 hover:via-gold hover:to-yellow-200 rounded-xl transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter group overflow-hidden transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                  <span className="relative">
                    {isSubmitting ? "Sending..." : "Get My Free Guide"}
                  </span>
                </button>
              </form>

              {/* No thanks */}
              <button
                onClick={closePopup}
                className="w-full mt-4 text-sm text-gray-500 hover:text-gray-300 transition-colors font-inter"
              >
                No thanks, I don&apos;t want free tips
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
