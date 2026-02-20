"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Route } from "next";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-6">
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
            Admin Dashboard Error
          </h1>
          <p className="text-white/60 font-inter mb-8">
            An error occurred while loading the admin dashboard. Please try again.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition-colors font-inter"
          >
            Retry
          </button>
          <Link
            href={"/admin/login" as Route}
            className="px-6 py-3 border border-gold/50 text-gold font-semibold rounded-lg hover:bg-gold/10 transition-colors font-inter"
          >
            Back to Login
          </Link>
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
