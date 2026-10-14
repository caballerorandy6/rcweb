"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

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
      <body className="min-h-screen flex items-center justify-center bg-gray-950 text-white font-sans">
        <div className="text-center max-w-md px-6">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-400 mb-8">
            We have been notified and are looking into it.
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-yellow-500 text-gray-900 font-bold rounded-lg"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
