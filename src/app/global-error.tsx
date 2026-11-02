"use client";

import * as Sentry from "@sentry/nextjs";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Button from "@/components/ui/Button";
import "./globals.css";

// Last resort: catches errors thrown by the root layout itself. It replaces
// the whole document, so it must render <html> and <body>.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  // Outside every provider: the URL is the only sign of the language
  const pathname = usePathname();
  const spanish = pathname === "/es" || pathname?.startsWith("/es/");

  return (
    <html lang={spanish ? "es" : "en"}>
      <body className="min-h-screen flex items-center justify-center bg-gray-950 text-white font-inter">
        <div className="text-center max-w-md px-6">
          <h1 className="text-4xl text-gold mb-4 font-iceland">{spanish ? "Algo salió mal" : "Something went wrong"}</h1>
          <p className="text-gray-400 mb-8">
            {spanish
              ? "El error se ha reportado automáticamente."
              : "The error has been reported automatically."}
          </p>
          <Button onClick={reset}>{spanish ? "Intentar de nuevo" : "Try again"}</Button>
        </div>
      </body>
    </html>
  );
}
