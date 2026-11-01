import localFont from "next/font/local";

// Both fonts are preloaded on purpose: Chrome holds the first paint (bounded)
// until a preloaded font arrives, so text renders in the real font straight
// away, with no swap and no layout shift. Without the preload the font lands
// after first paint: `swap` re-wraps long paragraphs (CLS 0.1 on /about and
// /services) and `optional` keeps Arial for the whole visit.
export const iceland = localFont({
  src: "./fonts/Iceland.woff2",
  variable: "--next-font-iceland",
  display: "swap",
  weight: "400",
  preload: true,
});

export const inter = localFont({
  // Basic Latin + typographic punctuation, weights 400-700 only (the site
  // uses normal/medium/semibold/bold): ~32 KB instead of the 85 KB
  // latin-ext build. Regenerate with fontTools (see fonts/README.md).
  src: "./fonts/InterVF-latin.woff2",
  variable: "--next-font-inter",
  display: "swap",
  preload: true,
});

/** Class names for `<html>`: both font variables */
export const fontVariables = `${iceland.variable} ${inter.variable}`;
