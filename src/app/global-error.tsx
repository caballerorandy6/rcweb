"use client";

import * as Sentry from "@sentry/nextjs";
import { usePathname } from "next/navigation";
import { useEffect, type CSSProperties } from "react";

// Last resort: catches errors thrown by the root layout itself. It replaces
// the whole document, so it must render <html> and <body>.
// Inline styles on purpose: importing globals.css here makes inlineCss embed
// the whole stylesheet a second time in the RSC payload of every page.
const styles = {
  body: {
    margin: 0,
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#030712",
    color: "#fff",
    fontFamily: "system-ui, sans-serif",
  },
  box: { textAlign: "center", maxWidth: "28rem", padding: "0 1.5rem" },
  title: { fontSize: "2.25rem", color: "#cbb26a", margin: "0 0 1rem" },
  text: { color: "#99a1af", margin: "0 0 2rem" },
  button: {
    padding: "0.75rem 1.5rem",
    border: 0,
    borderRadius: "0.75rem",
    background: "linear-gradient(to right, #cbb26a, #d9c98a, #cbb26a)",
    color: "#000",
    font: "600 1rem system-ui, sans-serif",
    cursor: "pointer",
  },
} satisfies Record<string, CSSProperties>;

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
      <body style={styles.body}>
        <div style={styles.box}>
          <h1 style={styles.title}>{spanish ? "Algo salió mal" : "Something went wrong"}</h1>
          <p style={styles.text}>
            {spanish
              ? "El error se ha reportado automáticamente."
              : "The error has been reported automatically."}
          </p>
          <button type="button" onClick={reset} style={styles.button}>
            {spanish ? "Intentar de nuevo" : "Try again"}
          </button>
        </div>
      </body>
    </html>
  );
}
