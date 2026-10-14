import * as Sentry from "@sentry/nextjs";

// Browser side. Without NEXT_PUBLIC_SENTRY_DSN (local development) the SDK
// stays disabled.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
  // Performance traces for 10% of page loads; errors are always captured
  tracesSampleRate: 0.1,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
