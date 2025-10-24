"use client";

import { useState, useTransition } from "react";
import { createFinalPaymentSessionAction } from "@/actions/payments/createFinalPaymentSessionAction";
import { verifyProjectAccessAction } from "@/actions/projects/verifyProjectAccessAction";
import { toast } from "sonner";

type ProjectInfo = {
  planName: string;
  projectCode: string;
  secondPayment: number;
};

export default function FinalPayment() {
  const [email, setEmail] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [isPending, startTransition] = useTransition();
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
  const [verified, setVerified] = useState(false);

  const handleVerify = async () => {
    if (!email || !projectCode) {
      toast.error("Please enter both email and project code");
      return;
    }

    startTransition(async () => {
      const result = await verifyProjectAccessAction(email, projectCode);

      if (result.success && result.payment) {
        setProjectInfo(result.payment);
        setVerified(true);
        toast.success("Project verified successfully!");
      } else {
        toast.error(result.error || "Verification failed");

        if (result.status === "in_progress") {
          toast.info(
            "Your project is still in progress. We'll notify you when it's ready!"
          );
        }
      }
    });
  };

  const handlePayment = async () => {
    const stripeTab = window.open("", "_blank");

    if (!stripeTab) {
      toast.error("Please allow popups to continue to payment.");
      return;
    }

    startTransition(async () => {
      const result = await createFinalPaymentSessionAction(email, projectCode);

      if (result.success && result.sessionUrl) {
        stripeTab.location.href = result.sessionUrl;
      } else {
        toast.error(result.error || "Failed to create payment session");
        stripeTab.close();
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl p-8">
        <h1 className="text-4xl font-bold mb-2 font-iceland text-gold">
          Complete Your Payment
        </h1>
        <p className="text-gray-400 mb-6 font-inter">
          Enter your project details to proceed with the final payment
        </p>

        {!verified ? (
          <>
            <div className="space-y-4 font-inter">
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-gold focus:outline-none"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Project Code
                </label>
                <input
                  type="text"
                  value={projectCode}
                  onChange={(e) => setProjectCode(e.target.value.toUpperCase())}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-gold focus:outline-none font-mono text-center text-xl tracking-wider"
                  placeholder="ABC123"
                  maxLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  The 6-character code from your initial payment
                </p>
              </div>
            </div>

            <button
              onClick={handleVerify}
              disabled={isPending}
              className="w-full mt-6 bg-gold text-gray-900 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50 font-inter"
            >
              {isPending ? "Verifying..." : "Verify Project"}
            </button>
          </>
        ) : (
          <>
            <div className="bg-gray-700 rounded-lg p-4 mb-6 font-inter">
              <h3 className="text-white font-semibold mb-3">Project Details</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">
                  <span className="text-gray-400">Project:</span>{" "}
                  <span className="text-white">{projectInfo?.planName}</span>
                </p>
                <p className="text-gray-300">
                  <span className="text-gray-400">Code:</span>{" "}
                  <span className="text-white font-mono">
                    {projectInfo?.projectCode}
                  </span>
                </p>
                <p className="text-gray-300">
                  <span className="text-gray-400">Final Payment:</span>{" "}
                  <span className="text-gold text-xl font-bold">
                    $
                    {projectInfo?.secondPayment
                      ? (projectInfo.secondPayment / 100).toFixed(2)
                      : "0.00"}
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isPending}
              className="w-full bg-gold text-gray-900 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50 font-inter"
            >
              {isPending ? "Processing..." : "Proceed to Payment"}
            </button>

            {/* <button
              onClick={() => {
                setVerified(false);
                setProjectInfo(null);
              }}
              className="w-full mt-3 hover:text-white transition-colors font-inter text-gold font-bold"
            >
              Use Different Project
            </button> */}
          </>
        )}

        <p className="text-sm text-gray-300 mt-6 text-center font-inter">
          Need help? Contact{" "}
          <span className="font-semibold text-gold">contactus@rcweb.dev</span>
        </p>
      </div>
    </div>
  );
}
