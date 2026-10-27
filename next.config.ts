import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

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
    // TikTok Content Posting API: /tools/tiktok sube el video por trozos
    // directamente al upload_url (open-upload.tiktokapis.com)
    "https://*.tiktokapis.com",
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
    // Facebook Pixel abre un iframe para algunos eventos
    "https://www.facebook.com",
  ],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  // Facebook Pixel envía eventos grandes como formulario POST a facebook.com/tr
  "form-action": ["'self'", "https://checkout.stripe.com", "https://www.facebook.com"],
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
