# AGENTS.md

Guidance for AI coding agents (Claude Code, Cursor, Copilot, Codex…) working in this repository. Claude Code also reads [CLAUDE.md](./CLAUDE.md), which has the full project map; this file is the short, tool-agnostic version.

## Stack

Next.js 16 (App Router, React Compiler, `next build --webpack`) · React 19 · TypeScript strict · Tailwind CSS 4 · Prisma 7 on Postgres (Railway) · NextAuth v5 · Stripe · Resend · Sentry · Vitest + Playwright · Vercel.

## Rule 0: use skills and current docs, not memory

Every major dependency has changed recently. Before writing code in an area, load the matching skill (listed in [CLAUDE.md → Skills](./CLAUDE.md#skills--use-them-dont-work-from-memory)) and check current docs (`context7`, or `node_modules/next/dist/docs/` for Next.js). In particular:

- `vercel:nextjs` — routing, RSC boundaries, async `params`/`cookies()`/`headers()`, `proxy.ts`, hydration, metadata, images, fonts, scripts.
- `vercel:react-best-practices` — run its checklist after editing `.tsx` components.
- `prisma-expert`, `stripe-best-practices`, `secure-code-guardian`, `e2e-testing-patterns`, `tailwind-css`, `fixing-*`, `seo-*` — see the table in CLAUDE.md.

## React & Next.js performance (Vercel Engineering, v1.0.0, 64 rules)

The full text lives in the `vercel:react-best-practices` skill (`AGENTS.md` inside it) and upstream at <https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices>. Apply by priority:

| Priority | Category | Examples |
|---|---|---|
| **CRITICAL** | 1. Eliminating waterfalls | `Promise.all` for independent fetches, defer `await` to the branch that needs it, preload in parallel, Suspense boundaries |
| **CRITICAL** | 2. Bundle size | No barrel imports, `next/dynamic` for heavy client code, defer third-party scripts, keep `'use client'` at the leaves |
| **HIGH** | 3. Server-side performance | Dedupe with `React.cache`, minimise serialised props, avoid per-request work that can be cached (`'use cache'`) |
| **MEDIUM-HIGH** | 4. Client-side data fetching | Dedupe/reuse requests (SWR/React Query patterns), no fetch-in-effect waterfalls |
| **MEDIUM** | 5. Re-render optimisation | Derived state instead of effects, lazy `useState` initialisers, stable callbacks, no `setState` in effects |
| **MEDIUM** | 6. Rendering performance | Content-visibility, virtualisation for long lists, cheap animations (transform/opacity), avoid layout thrash |
| **LOW-MEDIUM** | 7. JavaScript performance | Hot paths only: avoid repeated work in loops, early returns, cheap data structures |
| **LOW** | 8. Advanced patterns | Edge cases: `useSyncExternalStore`, transitions, streaming patterns |

## Project rules that agents get wrong most often

- Server Actions live in `src/actions/<domain>/` and end in `Action`; return `ActionResult<T>` / `ActionResultSimple`.
- Guard admin-only actions with `requireAdmin()`; validate input with Zod (`src/lib/zod.ts`) before touching the DB.
- Import Prisma types from `@/generated/prisma/client`, never `@prisma/client`.
- Node.js runtime only — never `export const runtime = "edge"`.
- Rate limiting is `src/lib/rateLimit.ts` (Postgres); there is no Redis.
- Tailwind 4: theme tokens go in `@theme` in `src/app/globals.css`; no styled-jsx, no `tailwind.config.js` colours.
- Tests: Vitest for `src/lib`, Playwright in `e2e/` with `.env.test` credentials only. CI must stay green.
- Commits in English; no AI attribution lines.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
