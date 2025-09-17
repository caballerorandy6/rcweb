"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { markProjectAsCompleteAction } from "@/actions/markProjectAsCompleteAction";

export default function PaymentCompletePage() {
  const searchParams = useSearchParams();
  const projectCode = searchParams.get("code");

  useEffect(() => {
    if (projectCode) {
      markProjectAsCompleteAction(projectCode).then((result) => {
        if (!result.success) {
          console.error("Error marking project as complete:", result.error);
        }
      });
    }
  }, [projectCode]);
  useEffect(() => {
    // Efecto de confetti
    if (typeof window !== "undefined") {
      import("canvas-confetti").then((confettiModule) => {
        const confetti = confettiModule.default;
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = {
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          zIndex: 0,
        };

        function randomInRange(min: number, max: number) {
          return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function () {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ["#fbbf24", "#f59e0b", "#d97706", "#ffffff"],
          });
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ["#fbbf24", "#f59e0b", "#d97706", "#ffffff"],
          });
        }, 250);
      });
    }

    // Marcar como completamente pagado en la base de datos
    if (projectCode) {
      fetch("/api/complete-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectCode }),
      }).catch((error) => {
        console.error("Error updating payment status:", error);
      });
    }
  }, [projectCode]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-24 lg:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-lg w-full bg-gray-800 rounded-2xl p-8 text-center relative z-10 border border-gold/20">
        {/* Success Icon */}
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
          <svg
            className="mx-auto h-20 w-20 text-green-500 relative"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2 font-iceland">
          Project Fully Paid! 🎉
        </h1>

        <p className="text-xl text-gold mb-6 font-inter">
          Thank you for your business!
        </p>

        <div className="bg-gray-700/50 rounded-lg p-6 mb-6 text-left">
          <h3 className="text-white font-semibold mb-4 text-center font-inter">
            What Happens Next:
          </h3>
          <ul className="space-y-3 text-sm text-gray-300 font-inter">
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>
                You&apos;ll receive an email with all project files and
                documentation within 24 hours
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>
                Access credentials for hosting and admin panels will be provided
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>
                Training session will be scheduled based on your availability
              </span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Support period begins today as per your plan</span>
            </li>
          </ul>
        </div>

        {projectCode && (
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-400 mb-1 font-inter">
              Project Reference:
            </p>
            <p className="text-2xl font-bold text-gold font-mono">
              {projectCode}
            </p>
            <p className="text-xs text-gray-500 mt-1 font-inter">
              Save this for your records
            </p>
          </div>
        )}

        <div className="space-y-3 font-inter">
          <Link
            href="/"
            className="block w-full bg-gold text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors"
          >
            Return to Home
          </Link>
          <a
            href="mailto:contactus@rcweb.dev"
            className="block w-full border border-gold/50 text-gold px-6 py-3 rounded-lg font-semibold hover:bg-gold/10 transition-colors"
          >
            Contact Support
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-400 font-inter">
            A detailed receipt has been sent to your email address.
          </p>
          <p className="text-xs text-gray-500 mt-2 font-inter">
            For any questions, please contact us at contactus@rcweb.dev
          </p>
        </div>
      </div>
    </div>
  );
}
