"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import type { Route } from "next";
import Button from "@/components/ui/Button";

export default function Error({
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
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-iceland text-white mb-4">
            Something went wrong
          </h1>
          <p className="text-white/60 font-inter mb-8">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset}>Try again</Button>
          <Button href={"/" as Route} variant="secondary">
            Go home
          </Button>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs text-white/50 font-inter">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
