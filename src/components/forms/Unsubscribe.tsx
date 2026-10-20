"use client";

import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { unsubscribeFromEmailAction } from "@/actions/campaigns/unsubscribeFromEmailAction";
import Button from "@/components/ui/Button";

export default function Unsubscribe() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleUnsubscribe = () => {
    if (!email) return;
    startTransition(async () => {
      const result = await unsubscribeFromEmailAction(email);
      if (result.success) setUnsubscribed(true);
    });
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white font-inter">Invalid unsubscribe link</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      {unsubscribed ? (
        <div className="max-w-md w-full rounded-2xl border border-gold/20 bg-gray-900/50 p-6 lg:p-8 shadow-lg shadow-black/20 text-center">
          <svg
            className="mx-auto h-16 w-16 text-green-500 mb-4"
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
          <h1 className="text-4xl text-gold mb-2 font-iceland">
            Unsubscribed Successfully
          </h1>
          <p className="text-gray-300 font-inter">
            {email} has been removed from our marketing emails.
          </p>
          <p className="text-sm text-gray-400 mt-4 font-inter">
            You will still receive transactional emails about your projects.
          </p>
          <Button href="/" variant="secondary" className="mt-6">
            Back to Home
          </Button>
        </div>
      ) : (
        <div className="max-w-md w-full rounded-2xl border border-gold/20 bg-gray-900/50 p-6 lg:p-8 shadow-lg shadow-black/20">
          <h1 className="text-4xl text-gold mb-2 font-iceland">
            Unsubscribe from Emails
          </h1>

          <p className="text-gray-300 font-inter mb-6">
            Are you sure you want to unsubscribe{" "}
            <span className="text-gold font-semibold font-inter">{email}</span>{" "}
            from marketing emails?
          </p>

          <div className="bg-gray-800/50 rounded-xl border border-gold/10 p-4 mb-6 font-inter">
            <p className="text-sm text-gray-400">You will no longer receive:</p>
            <ul className="mt-2 text-sm text-gray-300 space-y-1">
              <li>• Marketing updates</li>
              <li>• Service updates</li>
              <li>• Newsletter</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button
              variant="danger"
              onClick={handleUnsubscribe}
              disabled={isPending}
              className="flex-1"
            >
              {isPending ? "Processing..." : "Unsubscribe"}
            </Button>
            <Button href="/" variant="secondary" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
