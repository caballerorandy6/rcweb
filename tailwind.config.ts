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
        gold: "#CBB26A",
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
