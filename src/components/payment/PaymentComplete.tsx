"use client";

import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { COMPANY } from "@/lib/company";

export default function PaymentComplete() {
  const t = useTranslations("PaymentComplete");
  const searchParams = useSearchParams();
  const projectCode = searchParams.get("code");

  // El webhook de Stripe es la única fuente de verdad para marcar el pago final:
  // esta página solo celebra y muestra el código de referencia.
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
  }, []);

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

        <h1 className="text-4xl mb-2 font-iceland text-gold">
          {t("title")}
        </h1>

        <p className="text-xl text-white mb-6 font-inter">{t("thanks")}</p>

        <div className="bg-gray-700/50 rounded-lg p-6 mb-6 text-left">
          <h3 className="text-gold font-semibold mb-4 text-center font-inter">{t("nextTitle")}</h3>
          <ul className="space-y-3 text-sm text-gray-300 font-inter">
            {(t.raw("next") as string[]).map((item) => (
              <li key={item} className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-2 mt-0.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {projectCode && (
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-400 mb-1 font-inter">{t("reference")}</p>
            <p className="text-2xl font-bold text-gold font-mono">
              {projectCode}
            </p>
            <p className="text-xs text-gray-500 mt-1 font-inter">{t("save")}</p>
          </div>
        )}

        <div className="space-y-3 font-inter">
          <Button href="/" fullWidth>
            {t("home")}
          </Button>
          <Button href={`mailto:${COMPANY.contactEmail}`} variant="secondary" fullWidth>
            {t("support")}
          </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-400 font-inter">{t("receipt")}</p>
          <p className="text-xs text-gray-500 mt-2 font-inter">
            {t("questions", { email: COMPANY.contactEmail })}
          </p>
        </div>
      </div>
    </div>
  );
}
