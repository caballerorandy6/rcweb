import type { NextConfig } from "next";

// Content Security Policy
// Cada dominio de terceros está agrupado por servicio para que sea fácil
// auditar qué permite cada uno. Si se agrega un tracker nuevo, hay que
// permitir tanto el script como los endpoints a los que envía datos.
const cspDirectives: Record<string, string[]> = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    // Google Analytics 4 y Google Tag
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    // Google Ads
    "https://www.googleadservices.com",
    "https://googleads.g.doubleclick.net",
    // reCAPTCHA
    "https://www.google.com",
    "https://www.gstatic.com",
    // Facebook Pixel
    "https://connect.facebook.net",
    // LinkedIn Insight Tag
    "https://snap.licdn.com",
    // Calendly
    "https://assets.calendly.com",
  ],
  "style-src": [
    "'self'",
    "'unsafe-inline'",
    "https://fonts.googleapis.com",
    "https://assets.calendly.com",
  ],
  "font-src": ["'self'", "https://fonts.gstatic.com"],
  "img-src": ["'self'", "data:", "blob:", "https:", "http:"],
  "connect-src": [
    "'self'",
    // Google Analytics 4: GA4 envía hits a subdominios regionales
    "https://www.google-analytics.com",
    "https://*.google-analytics.com",
    "https://analytics.google.com",
    "https://*.analytics.google.com",
    "https://stats.g.doubleclick.net",
    "https://www.googletagmanager.com",
    // Google Ads (conversiones y remarketing)
    "https://www.google.com",
    "https://google.com",
    "https://ad.doubleclick.net",
    "https://googleads.g.doubleclick.net",
    "https://www.googleadservices.com",
    "https://pagead2.googlesyndication.com",
    // Facebook Pixel
    "https://connect.facebook.net",
    "https://www.facebook.com",
    // LinkedIn Insight Tag
    "https://px.ads.linkedin.com",
    "https://px4.ads.linkedin.com",
    // Stripe, Vercel y Calendly
    "https://api.stripe.com",
    "https://vitals.vercel-insights.com",
    "https://*.vercel-analytics.com",
    "https://calendly.com",
  ],
  "frame-src": [
    "'self'",
    "https://js.stripe.com",
    "https://www.google.com",
    "https://recaptcha.google.com",
    "https://calendly.com",
    // Google Ads usa iframes para conversiones
    "https://td.doubleclick.net",
    "https://bid.g.doubleclick.net",
    "https://www.googletagmanager.com",
  ],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'", "https://checkout.stripe.com"],
};

const contentSecurityPolicy = Object.entries(cspDirectives)
  .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
  .join("; ");

// Security headers configuration
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
];

const nextConfig: NextConfig = {
  // Security headers for all routes
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  // React Compiler (Next.js 16+)
  reactCompiler: true,

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },

  // Transpile packages to fix Turbopack ESM bundling issues
  transpilePackages: [
    "framer-motion",
    "react-markdown",
    "hast-util-to-jsx-runtime",
    "property-information",
  ],

  // Eliminar console.log en producción para reducir bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
      ? {
          exclude: ["error", "warn"], // Mantener console.error y console.warn para debugging
        }
      : false, // NO eliminar console.log en desarrollo
  },

  // Rutas tipadas (movido de experimental en Next.js 15.5+)
  typedRoutes: true,

  // External packages configuration
  // Prisma packages needed for driver adapters with WASM modules
  serverExternalPackages: [
    '@prisma/client',
    '@prisma/adapter-pg',
    'prisma',
  ],

  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
