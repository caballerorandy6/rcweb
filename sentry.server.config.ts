import * as Sentry from "@sentry/nextjs";

// Node.js runtime (Server Components, Server Actions, route handlers)
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
