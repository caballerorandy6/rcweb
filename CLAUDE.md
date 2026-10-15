# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About

RC Web Solutions (rcweb.dev) — professional web development company site with admin CRM, blog, Stripe payments (50/50 split), email/SMS campaigns, and AI chat. Built for small businesses in Houston, TX.

The password-protected client portal (`client/`) is being removed: there will be no registered clients, only token links (`/pay/[token]`, `/project/[accessToken]`) and invoices by email. One role: admin.

## Commands

```bash
npm run dev              # Dev server (localhost:3000)
npm run build            # Production build (uses --webpack flag)
npm run lint             # ESLint
npm test                 # Vitest unit tests (src/**/*.test.ts)
npm run test:e2e         # Playwright (chromium, port 3100, reads .env.test)
npx next typegen         # Regenerate next-env.d.ts (run before tsc in CI)
npx prisma generate      # Regenerate Prisma Client (also runs on postinstall)
npx prisma db push       # Sync schema to DB without migration
npm run migrate          # Prisma migrate dev
npm run seed             # Seed database (tsx prisma/seed.ts)
npm run seed:dev         # Test admin/client accounts from .env.test (localhost DB only)
npm run email            # React Email preview (port 3001)
```

**Note:** Build uses `next build --webpack` (not Turbopack). React Compiler is enabled.

## Skills — use them, don't work from memory

The stack moves fast (Next.js 16, React 19, Prisma 7, Tailwind 4, Zod 4). Before writing or reviewing code in an area, **invoke the matching skill** with the Skill tool; for library APIs, confirm against current docs with `context7`. Memory of older versions is not a source of truth.

| When you touch… | Invoke |
|---|---|
| Routing, Server Components/Actions, layouts, `proxy.ts`, hydration, metadata, `next/image`, fonts, scripts | `vercel:nextjs` |
| Any `.tsx` component (after editing, run the review checklist) | `vercel:react-best-practices` |
| Caching: `'use cache'`, `cacheLife`, `cacheTag`, PPR | `vercel:next-cache-components` |
| Prisma schema, migrations, queries, relations | `prisma-expert` |
| Stripe checkout, webhooks, invoices, API version bumps | `stripe-best-practices`, `upgrade-stripe` |
| Auth, input validation, anything OWASP | `secure-code-guardian` |
| Playwright / Vitest tests | `e2e-testing-patterns` |
| Tailwind classes, theme tokens in `globals.css` | `tailwind-css` |
| Accessibility, metadata/OG, animation performance | `fixing-accessibility`, `fixing-metadata`, `fixing-motion-performance` |
| UI review against web interface guidelines | `web-design-guidelines` |
| SEO audits, structured data | `seo-audit`, `schema-markup`, `seo-*` |
| Vercel env vars, deployments, CLI, previews with Deployment Protection | `vercel:env-vars`, `vercel:deployments-cicd`, `vercel:vercel-cli`, `vercel:access-protected-vercel-deployment` |
| Adding an external service (monitoring, email, search…) | `vercel:marketplace` |
| Upgrading Next.js majors | `vercel:next-upgrade` |

`vercel:*` skills come from the Vercel plugin (always current). Unprefixed ones live in `.claude/skills/` (project) or `~/.claude/skills/` (user). Prefer `vercel:nextjs` and `vercel:react-best-practices` over the older user-level `nextjs` / `vercel-react-best-practices` copies.

Also read the Next.js docs shipped with the installed version (`node_modules/next/dist/docs/`) when an API looks different from what you expect — see the block at the end of [AGENTS.md](./AGENTS.md).

## Architecture

### Key Patterns

- **Next.js 16 App Router** with Server Components by default. `'use client'` only when state/effects/browser APIs are needed.
- **Server Actions** live in `src/actions/` (not colocated with components), organized by domain. Named with `Action` suffix: `createContactAction`, `sendNewsletterAction`.
- **Auth:** NextAuth v5 with a single Credentials provider. Use `auth()` in Server Components, `requireAdmin()` from `src/lib/authGuard.ts` in Server Actions. Login lockout: 5 failures / 15 min per email (`src/lib/auth.ts`).
- **Rate limiting:** Postgres sliding window in `src/lib/rateLimit.ts` (`rateLimiters.chat|contact|api|login`, fail-open to Sentry). No Redis.
- **Action return types:** `ActionResult<T>` (with data) or `ActionResultSimple` (void) from `src/types/common.ts`.
- **Prisma Client** is generated to `src/generated/prisma/` — import types from `@/generated/prisma/client`, not `@prisma/client`. Config in `prisma.config.ts`; DB over TLS with pinned CA (`src/lib/dbSsl.ts`).
- **Forms:** React Hook Form + Zod resolver. Schemas in `src/lib/zod.ts`. Toast notifications via Sonner.
- **State:** Zustand store at `src/store/rcweb-store.ts`.
- **Email:** Resend with daily quota control (`src/lib/sendEmailWithQuota.ts`). Templates in `src/emails/` using React Email.
- **Blog:** MDX files in `/content/blog/`, parsed with gray-matter via `src/lib/blog.ts`.
- **Errors:** Sentry (`@sentry/nextjs`, tunnel `/monitoring`, `src/instrumentation*.ts`, `src/app/error.tsx`, `global-error.tsx`).
- **Runtime:** Node.js everywhere. Do not add `export const runtime = "edge"`.

### Route Groups

- `(admin)/` — protected admin dashboard, CRM, campaign management
- `client/` — client portal (scheduled for removal, see About)
- `pay/[token]` — Stripe payment pages
- `project/[accessToken]` — public project view links

### Payment Flow (50/50)

Admin creates Payment → Client gets email → Accepts terms → Stripe Checkout (50%) → Webhook processes → Invoice PDF generated → Project starts → Admin marks ready → Final 50% payment → Complete.

## Testing

- **Vitest** for pure logic (`src/lib/*.test.ts`); mock Prisma/Sentry with `vi.hoisted` + `vi.mock`.
- **Playwright** in `e2e/` against `next dev -p 3100`; admin tests use `TEST_ADMIN_*` from `.env.test` (never real credentials).
- **CI** (`.github/workflows/ci.yml`): lint → `next typegen` → tsc → vitest, then e2e with a Postgres service. Keep it green before merging.

## Code Conventions

- **TypeScript only**, strict mode
- **Imports:** `@/*` maps to `./src/*`
- **Files:** kebab-case. **Components:** PascalCase. **Actions:** camelCase + `Action` suffix.
- **Styling:** Tailwind CSS v4, mobile-first; theme tokens (`--color-*`, `--animate-*`) in `src/app/globals.css`. No styled-jsx. Headless UI for interactive components. Heroicons for icons. Framer Motion for animations.
- **Validation:** Always validate with Zod before DB operations.
- **Data fetching:** Use `Promise.all()` for independent parallel fetches — never waterfall.

## Performance Rules

Follow Vercel Engineering's React Best Practices (64 rules, v1.0.0) via the `vercel:react-best-practices` skill, ordered CRITICAL → LOW. Priority summary in [AGENTS.md](./AGENTS.md). Key ones: eliminate waterfalls, defer awaits, parallel fetching, proper `'use client'` boundaries, no barrel imports.

## Git

- Descriptive commits in English
- **DO NOT** include mentions of Claude, AI, or "Generated with" in commits
- **DO NOT** add Co-Authored-By from Claude/Anthropic

## Shorthand Commands

- `sr` → respond only (no tool execution)
- `rv` → review and respond (no code modification)
