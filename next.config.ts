import type { NextConfig } from "next";

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
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https: http:; connect-src 'self' https://www.google-analytics.com https://api.stripe.com https://vitals.vercel-insights.com https://*.vercel-analytics.com; frame-src 'self' https://js.stripe.com https://www.google.com https://recaptcha.google.com; object-src 'none'; base-uri 'self'; form-action 'self' https://checkout.stripe.com;",
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
        hostname: "**",
      },
    ],
  },

  // Transpile framer-motion para evitar problemas con export *
  transpilePackages: ["framer-motion"],

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
    'prettier',
  ],

  // Experimental features
  experimental: {
    // ppr: true,  // Partial Prerendering (si lo necesitas)
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Turbopack configuration (Next.js 16+)
  turbopack: {},
};

export default nextConfig;
