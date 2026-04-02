# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About

RC Web Solutions (rcweb.dev) — professional web development company site with admin CRM, client portal, blog, Stripe payments (50/50 split), email/SMS campaigns, and AI chat. Built for small businesses in Houston, TX.

## Commands

```bash
npm run dev              # Dev server (localhost:3000)
npm run build            # Production build (uses --webpack flag)
npm run lint             # ESLint
npx prisma generate      # Regenerate Prisma Client (also runs on postinstall)
npx prisma db push       # Sync schema to DB without migration
npm run migrate          # Prisma migrate dev
npm run seed             # Seed database (tsx prisma/seed.ts)
npm run email            # React Email preview (port 3001)
```

**Note:** Build uses `next build --webpack` (not Turbopack). React Compiler is enabled.

## Architecture

### Key Patterns

- **Next.js 16 App Router** with Server Components by default. `'use client'` only when state/effects/browser APIs are needed.
- **Server Actions** live in `src/actions/` (not colocated with components), organized by domain. Named with `Action` suffix: `createContactAction`, `sendNewsletterAction`.
- **Auth:** NextAuth v5 with single Credentials provider handling both Admin and Client roles. Use `auth()` in Server Components, `requireAdmin()`/`requireClient()` from `src/lib/authGuard.ts` in Server Actions.
- **Action return types:** `ActionResult<T>` (with data) or `ActionResultSimple` (void) from `src/types/common.ts`.
- **Prisma Client** is generated to `src/generated/prisma/` — import types from `@/generated/prisma/client`, not `@prisma/client`.
- **Forms:** React Hook Form + Zod resolver. Schemas in `src/lib/zod.ts`. Toast notifications via Sonner.
- **State:** Zustand store at `src/store/rcweb-store.ts`.
- **Email:** Resend with daily quota control (`src/lib/sendEmailWithQuota.ts`). Templates in `src/emails/` using React Email.
- **Blog:** MDX files in `/content/blog/`, parsed with gray-matter via `src/lib/blog.ts`.

### Route Groups

- `(admin)/` — protected admin dashboard, CRM, campaign management
- `client/` — authenticated client portal (projects, messages, deliverables)
- `pay/[token]` — Stripe payment pages
- `project/[accessToken]` — public project view links

### Payment Flow (50/50)

Admin creates Payment → Client gets email → Accepts terms → Stripe Checkout (50%) → Webhook processes → Invoice PDF generated → Project starts → Admin marks ready → Final 50% payment → Complete.

## Code Conventions

- **TypeScript only**, strict mode
- **Imports:** `@/*` maps to `./src/*`
- **Files:** kebab-case. **Components:** PascalCase. **Actions:** camelCase + `Action` suffix.
- **Styling:** Tailwind CSS, mobile-first. Headless UI for interactive components. Heroicons for icons. Framer Motion for animations.
- **Validation:** Always validate with Zod before DB operations.
- **Data fetching:** Use `Promise.all()` for independent parallel fetches — never waterfall.

## Performance Rules

Follow the 45 Vercel Engineering rules in [AGENTS.md](./AGENTS.md), ordered CRITICAL → LOW. Key ones: eliminate waterfalls, defer awaits, parallel fetching, proper `'use client'` boundaries.

## Git

- Descriptive commits in English
- **DO NOT** include mentions of Claude, AI, or "Generated with" in commits
- **DO NOT** add Co-Authored-By from Claude/Anthropic

## Shorthand Commands

- `sr` → respond only (no tool execution)
- `rv` → review and respond (no code modification)
