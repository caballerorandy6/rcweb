import * as Sentry from "@sentry/nextjs";

// Browser side. Without NEXT_PUBLIC_SENTRY_DSN (local development) the SDK
// stays disabled. Errors only: tracing is tree-shaken out of the bundle via
// bundleSizeOptimizations.excludeTracing in next.config.ts.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
});
