"use client";

import * as Sentry from "@sentry/nextjs";
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

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-gray-950 text-white font-inter">
        <div className="text-center max-w-md px-6">
          <h1 className="text-4xl text-gold mb-4 font-iceland">Something went wrong</h1>
          <p className="text-gray-400 mb-8">
            We have been notified and are looking into it.
          </p>
          <Button onClick={reset}>Try again</Button>
        </div>
      </body>
    </html>
  );
}
