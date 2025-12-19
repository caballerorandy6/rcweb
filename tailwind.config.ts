import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        gold: {
          DEFAULT: "#CBB26A",
          dark: "#A89048",
          light: "#D9C98A",
        },
        // UI colors
        dark: "#1a1a1a",
        // Status colors are already in Tailwind (green, red, blue, etc.)
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        iceland: ["var(--font-iceland)", "cursive"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
  // Optimize for production
  future: {
    hoverOnlyWhenSupported: true,
  },
} satisfies Config;
