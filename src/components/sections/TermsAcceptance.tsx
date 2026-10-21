"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ShieldCheckIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import BackButton from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import { createStripeCheckoutAction } from "@/actions/payments/createStripeCheckoutAction";
import { getCheckoutCustomer } from "@/lib/checkoutCustomer";

/**
 * The checkout flow sends the visitor here with `?plan=<id>` (customer data
 * waits in sessionStorage). Both pieces render nothing for a visitor who is
 * simply reading the terms from the footer.
 */

export function TermsReviewNotice() {
  const planId = useSearchParams().get("plan");
  if (!planId) return null;

  return (
    <div className="mb-8 max-w-5xl mx-auto animate-enter">
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="shrink-0">
            <ExclamationTriangleIcon className="w-10 h-10 text-amber-500" />
          </div>
          <div className="grow">
            <h2 className="text-amber-500 text-2xl mb-1 font-iceland">
              Important: Review Required
            </h2>
            <p className="text-white/80 text-sm sm:text-base font-inter">
              Please carefully review and accept our Terms of Service before
              proceeding to payment. This legal agreement outlines the
              conditions of our service.
            </p>
          </div>
          <BackButton className="shrink-0" />
        </div>
      </div>
    </div>
  );
}

export function TermsAcceptActions() {
  const router = useRouter();
  const planId = useSearchParams().get("plan");
  const [isPending, startTransition] = useTransition();

  if (!planId) return null;

  const handleAcceptTerms = () => {
    const customer = getCheckoutCustomer();

    if (!customer) {
      toast.error("Missing information. Please start from pricing.");
      router.push("/#pricing");
      return;
    }

    startTransition(async () => {
      try {
        toast.loading("Processing…");

        // El servidor calcula precio y fecha de aceptación de términos.
        const result = await createStripeCheckoutAction({ planId, customer });

        toast.dismiss();

        if (result.success && result.sessionUrl) {
          toast.success("Redirecting to secure payment…");

          if (result.projectCode) {
            sessionStorage.setItem("tempProjectCode", result.projectCode);
          }

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

  return (
    <div className="mt-12 max-w-5xl mx-auto reveal">
      <div className="text-center mb-6 font-inter flex flex-col items-center">
        <p className="text-white/70 text-sm">
          By clicking &quot;I Accept These Terms&quot;, you confirm that you
          have read, understood, and agree to be bound by these Terms of
          Service.
        </p>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleAcceptTerms} disabled={isPending}>
          <ShieldCheckIcon className="w-5 h-5" />
          {isPending ? "Processing…" : "I Accept These Terms"}
        </Button>
      </div>

      <div className="mt-6 text-center font-inter">
        <Link
          href="/#pricing"
          className="text-white/50 hover:text-gold underline text-sm transition-colors"
        >
          Return to Pricing Plans
        </Link>
      </div>
    </div>
  );
}
