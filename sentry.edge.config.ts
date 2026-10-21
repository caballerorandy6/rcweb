import * as Sentry from "@sentry/nextjs";

// Edge runtime. Errors only: tracing is tree-shaken out via
// bundleSizeOptimizations.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
});
