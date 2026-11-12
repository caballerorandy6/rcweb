# RC Web Solutions

**Bilingual business site and back office for my web development studio** — marketing pages, quotes, Stripe payments, client project tracking, email/SMS campaigns and SEO dashboards in one Next.js app.

**Live:** [rcweb.dev](https://rcweb.dev)

![RC Web Solutions](public/og-image.jpg)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7-2d3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169e1?logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38b2ac?logo=tailwindcss)
![Stripe](https://img.shields.io/badge/Stripe-635bff?logo=stripe&logoColor=white)

## What it does

### Public site (English and Spanish)
- Services, portfolio, case studies, blog (Markdown) and a local landing page, all translated with `next-intl` (`/en`, `/es`).
- AI chat assistant (OpenAI) that answers questions about services.
- Contact and scheduling flow with reCAPTCHA, Calendly and email notifications (Resend).
- SEO: per-page metadata, sitemap, robots, `llms.txt` and structured data.

### Client flow
- **Quotes:** the admin builds a quote; the client opens it from a private link, accepts the terms and pays the deposit.
- **Payments:** Stripe Checkout for deposits and final payments, monthly maintenance subscriptions, and webhooks that update the database.
- **Project tracking:** each client gets a private project page with milestones and status.
- **Invoices:** generated as PDF with `@react-pdf/renderer`.

### Back office (admin only)
- Dashboard with contacts, quotes, projects, invoices and subscriptions.
- Email campaigns (Resend + React Email) with daily quota, delivery logs and unsubscribe links.
- SMS campaigns and a business phone line with Twilio (incoming SMS, call forwarding, recordings and transcriptions).
- Google Search Console and Google Business Profile reviews, synced daily by Vercel Cron and charted with Recharts.

## Tech stack

| Area | Tools |
|---|---|
| Framework | Next.js 16 (App Router, Server Components, Server Actions), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Data | PostgreSQL, Prisma 7 (`@prisma/adapter-pg`), Zod |
| Auth | NextAuth v5 (credentials, bcrypt) for the admin area |
| Payments | Stripe (Checkout, subscriptions, webhooks) |
| Messaging | Resend + React Email, Twilio (SMS and voice) |
| Integrations | OpenAI, Google Search Console, Google Business Profile, Vercel Blob |
| State and forms | Zustand, React Hook Form |
| Monitoring | Sentry |
| Testing | Vitest (unit), Playwright (end-to-end) |
| Hosting | Vercel (with Vercel Cron) |

## Project structure

```
src/
  app/
    [locale]/        public pages (en/es)
    (backoffice)/    admin login and dashboard
    api/             chat, auth, Stripe webhook, Twilio, cron jobs, invoices
  actions/           server actions
  components/        UI components
  lib/               database, email, payments, integrations
  messages/          translations (en, es)
content/             blog posts and legal pages in Markdown
prisma/              schema, migrations and seeds
e2e/                 Playwright tests
```

## Getting started

**Requirements:** Node.js 20.9+ and PostgreSQL.

```bash
git clone https://github.com/caballerorandy6/rcweb.git
cd rcweb
npm install          # also runs prisma generate
# create .env.local with the variables below
npm run migrate      # create the database tables
npm run seed         # create the admin user
cp .env.test.example .env.test && npm run seed:dev   # optional test accounts
npm run dev          # http://localhost:3000
```

### Environment variables

Minimum to run the site locally:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | NextAuth secret |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | First admin user (seed) |
| `NEXT_PUBLIC_BASE_URL` | Site URL, e.g. `http://localhost:3000` |

Optional, by feature: `STRIPE_*` (payments), `RESEND_API_KEY` (email), `TWILIO_*` (SMS and voice), `OPENAI_API_KEY` (chat), `RECAPTCHA_*` (forms), `BLOB_READ_WRITE_TOKEN` (uploads), `GOOGLE_OAUTH_*`, `GBP_*` and `SEARCH_CONSOLE_SITE_URL` (Google data), `CRON_SECRET` (cron routes), `SENTRY_*` (monitoring), `NEXT_PUBLIC_GA_MEASUREMENT_ID` and other `NEXT_PUBLIC_*` IDs (analytics).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Apply migrations and build for production |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | End-to-end tests (Playwright) |
| `npm run migrate` | Create and apply a migration in development |
| `npm run seed` / `seed:dev` | Seed the database |

## Deployment

Deployed on Vercel from `main`. The build runs `prisma migrate deploy` before `next build`. Two Vercel Cron jobs (`vercel.json`) sync Search Console data daily and Google reviews weekly.

## Author

**Randy Caballero** — Full-Stack Developer, Houston, TX
[rcweb.dev](https://rcweb.dev) · [LinkedIn](https://linkedin.com/in/caballerorandy) · [GitHub](https://github.com/caballerorandy6)

© RC Web Solutions LLC. All rights reserved.
