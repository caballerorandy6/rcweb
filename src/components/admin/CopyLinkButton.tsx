"use client";

import { toast } from "sonner";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";

type CopyLinkButtonProps = {
  url: string;
  /** Visible button text */
  label: string;
  /** Toast shown after copying; defaults to "Link copied" */
  copiedMessage?: string;
  className?: string;
};

const base =
  "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors bg-gray-700/40 text-gray-200 border-gray-600 hover:bg-gray-700/70";

/** Copies a URL to the clipboard and confirms with a toast */
export default function CopyLinkButton({
  url,
  label,
  copiedMessage = "Link copied",
  className = "",
}: CopyLinkButtonProps) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(copiedMessage);
    } catch {
      toast.error("Could not copy the link");
    }
  };

  return (
    <button type="button" onClick={copy} className={`${base} ${className}`}>
      <ClipboardDocumentIcon className="w-4 h-4" aria-hidden="true" />
      {label}
    </button>
  );
}
