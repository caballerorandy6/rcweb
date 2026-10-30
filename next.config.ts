import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

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
    // The legacy XSS auditor is gone from every browser and used to open
    // holes of its own; "0" is what OWASP recommends. The CSP covers XSS.
    key: "X-XSS-Protection",
    value: "0",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The blog had its own subscriber list; it is now part of the newsletter
      { source: "/blog/unsubscribe", destination: "/unsubscribe", permanent: true },
      // The free guide was retired; keep indexed links alive
      { source: "/guide", destination: "/#contact", permanent: true },
      // No more promotions: old campaign links to the offer land on pricing
      { source: "/offer", destination: "/#pricing", permanent: true },
      // /services now has one page per offer; the old technology/feature
      // pages fold into them
      {
        source: "/services/nextjs-development-houston",
        destination: "/services/admin-dashboard-houston",
        permanent: true,
      },
      {
        source: "/services/bilingual-websites-houston",
        destination: "/services/web-design-houston",
        permanent: true,
      },
      {
        source: "/services/seo-local-houston",
        destination: "/services/web-design-houston",
        permanent: true,
      },
      // Posts about features that no longer exist (n8n, Upstash, client
      // portal, 2025 pricing, promotions) were removed; keep indexed links alive
      ...[
        "n8n-automation-lead-nurturing-nextjs",
        "n8n-automation-marketing-small-business",
        "n8n-milestone-notifications-client-portal",
        "learn-n8n-fast-claude-ai-assistant",
        "rate-limiting-nextjs-upstash-redis",
        "client-admin-messaging-system-nextjs",
        "client-project-tracker-nextjs-transparency",
        "updated-web-development-services-pricing-2025",
        "welcome-to-rc-web-solutions",
        "black-friday-cyber-monday-2025-ecommerce-preparation",
      ].map((slug) => ({
        source: `/blog/${slug}`,
        destination: "/blog",
        permanent: true,
      })),
    ];
  },

  // Static security headers for all routes. The Content-Security-Policy
  // needs a nonce per request, so it is set in src/proxy.ts instead.
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
    // Tailwind's CSS is small (~6 KB gzip); shipping it inside the HTML
    // removes the render-blocking stylesheet round trip before first paint
    inlineCss: true,
  },
};

export default withSentryConfig(nextConfig, {
  // Provided by the Vercel <-> Sentry integration
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Upload source maps so stack traces point to the TypeScript source
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Browser events go through our own origin: survives ad blockers and
  // needs no CSP change
  tunnelRoute: "/monitoring",
  silent: !process.env.CI,
  // Errors only on the client: tree-shake tracing (and debug logging) so the
  // chunk every page loads stays ~30 KB gzip smaller
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
    excludeTracing: true,
  },
});
