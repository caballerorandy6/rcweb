"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

interface BackButtonProps {
  className?: string;
}

/** History back button: the only client bit of the legal pages */
export default function BackButton({ className }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={clsx(
        "inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-600 font-inter transition hover:scale-105 active:scale-95",
        className
      )}
    >
      <ArrowLeftIcon className="w-4 h-4" />
      Go Back
    </button>
  );
}
