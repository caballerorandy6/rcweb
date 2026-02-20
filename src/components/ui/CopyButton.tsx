"use client";

import { useState } from "react";

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copyCode}
      className="px-3 py-1 bg-gold/20 text-gold rounded hover:bg-gold/30 transition-colors font-inter"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
