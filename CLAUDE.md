# RC Web Solutions - rcweb.dev

## React & Next.js Performance Rules

**IMPORTANT:** Follow all performance optimization rules defined in [AGENTS.md](./AGENTS.md) when writing, reviewing, or refactoring React/Next.js code. These are 45 rules from Vercel Engineering, ordered by impact (CRITICAL → LOW).

---

## About the Project

Professional website for RC Web Solutions LLC, a web development company founded by Randy Caballero. Offers web development services for small businesses and entrepreneurs in Houston, TX.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS |
| UI Components | Headless UI + Heroicons |
| Animations | Framer Motion |
| Database | PostgreSQL + Prisma ORM |
| Global State | Zustand |
| Forms | React Hook Form + Zod |
| Authentication | NextAuth v5 (beta) |
| Payments | Stripe |
| Email | Resend + React Email |
| SMS | Twilio |
| AI | OpenAI |
| Storage | Vercel Blob |
| Rate Limiting | Upstash Redis |
| Analytics | Vercel Analytics |
| Hosting | Vercel |
| Domain | rcweb.dev |

---

## Project Structure

```
src/
├── app/                      # App Router
│   ├── (admin)/              # Admin route group (protected)
│   ├── admin/                # Admin login
│   ├── api/                  # API Routes
│   │   ├── auth/[...nextauth]
│   │   ├── chat/
│   │   ├── blog/
│   │   └── email-webhook/
│   ├── blog/                 # Public blog + [slug]
│   ├── client/               # Client portal (authenticated)
│   ├── project/[accessToken] # Public project view
│   ├── pay/[token]           # Stripe payment page
│   ├── components/           # React components
│   │   ├── ui/               # Base components
│   │   ├── forms/            # Forms
│   │   ├── sections/         # Landing sections
│   │   ├── layout/           # Header, Footer, etc.
│   │   ├── admin/            # Admin components
│   │   ├── client/           # Client portal components
│   │   ├── blog/             # Blog components
│   │   ├── payment/          # Payment components
│   │   ├── auth/             # Authentication components
│   │   ├── icons/            # Custom icons
│   │   ├── seo/              # Meta tags, structured data
│   │   ├── tracking/         # Analytics
│   │   ├── skeletons/        # Loading states
│   │   └── wrappers/         # HOCs and wrappers
│   ├── schedule/             # Schedule consultation
│   ├── offer/                # Special offers
│   ├── guide/                # Downloadable guide
│   ├── login/                # Client login
│   ├── privacy-policy/
│   ├── terms-of-service/
│   ├── refund-policy/
│   ├── manage-subscription/
│   ├── payment-success/
│   ├── payment-complete/
│   ├── final-payment/
│   ├── thank-you/
│   └── unsubscribe/
├── actions/                  # Server Actions (60+)
│   ├── admin/
│   ├── auth/
│   ├── campaigns/
│   ├── client/
│   ├── contacts/
│   ├── deliverables/
│   ├── invoices/
│   ├── messages/
│   ├── milestones/
│   ├── payments/
│   ├── projects/
│   ├── stats/
│   └── subscriptions/
├── store/                    # Zustand stores
├── hooks/                    # Custom hooks
├── lib/                      # Core utilities
│   ├── prisma.ts
│   ├── auth.ts
│   ├── authGuard.ts
│   ├── rateLimit.ts
│   ├── zod.ts
│   ├── blob.ts
│   ├── blog.ts
│   ├── email/
│   └── invoice/
├── emails/                   # React Email templates
├── config/                   # Configurations
├── types/                    # TypeScript types/interfaces
├── utils/                    # General utilities
└── generated/                # Generated Prisma Client
```

---

## Database Models (Prisma)

### CRM and Contacts
- `Contact` - Contacts with lead nurturing
- `ContactEmail` - Contact emails
- `ContactPhone` - Contact phones
- `ContactActivity` - Activity log

### Users
- `Admin` - System administrators
- `Client` - Portal clients
- `User` - General users

### Projects and Payments
- `Payment` - Projects with 50/50 payment system
- `Milestone` - Project milestones
- `MilestoneNotification` - Milestone notifications
- `Deliverable` - Project deliverables
- `Invoice` - PDF invoices
- `TermsAcceptance` - Terms acceptance

### Subscriptions
- `Subscription` - Monthly subscriptions (maintenance)

### Messaging
- `ProjectMessage` - Client ↔ admin messages
- `ProjectMessageAttachment` - File attachments

### Marketing
- `EmailCampaign` - Email campaigns
- `CampaignEmailLog` - Sent emails log
- `DailyEmailQuota` - Daily quota control
- `SmsCampaign` - SMS campaigns
- `SmsLog` - SMS log

### Blog
- `BlogSubscriber` - Blog subscribers
- `NotifiedBlogPost` - Notified posts

---

## Main Commands

```bash
# Development
npm run dev              # Local development (localhost:3000)
npm run build            # Production build
npm run start            # Start build
npm run lint             # ESLint

# Database
npx prisma studio        # Database GUI
npx prisma db push       # Sync schema
npx prisma generate      # Generate Prisma Client
npm run migrate          # Development migration
npm run seed             # Data seed

# Email
npm run email            # Email preview (port 3001)

# Testing
npm run test:twilio      # Twilio test
npm run test:webhook     # Webhooks test
```

---

## Critical Flows

### 1. Payment Process (50/50)
```
Admin creates Payment → Client receives email with link
→ Client accepts terms → Stripe Checkout (50%)
→ Webhook processes payment → PDF Invoice generated
→ Email with invoice → Project starts
→ Admin marks "ready" → Final payment email
→ Client pays remaining 50% → Project completed
```

### 2. Client Portal
```
Client receives setup email → Sets password
→ Login at /client → Dashboard with projects
→ Views milestones, deliverables, invoices
→ Can send messages to admin
→ Downloads deliverables when project completes
```

### 3. Messaging System
```
Client or Admin writes message
→ Server Action saves to DB
→ Notification email to recipient
→ Messages marked as read
```

### 4. Lead Nurturing
```
Contact arrives (form, SMS) → Status: NEW
→ Admin manages in CRM
→ Activities logged
→ Email/SMS campaigns
```

### 5. Blog
```
MDX in /content/blog → Rendered with gray-matter
→ Subscribers receive notification
→ Unsubscribe with token
```

---

## Rules for Claude

### General Principle
- Review with maximum depth following best practices
- NEVER force unnecessary changes
- Always keep code simple and readable as needed
- If something works well, don't change it just to "improve"
- `sr` → respond only (no tool execution)
- `rv` → review and respond (no code modification)

### Code
- Always TypeScript, never JavaScript
- Server Components by default
- `'use client'` only when strictly necessary
- Server Actions for mutations (located in `/src/actions/`)
- Always validate inputs with Zod
- Handle errors with try/catch
- Use Prisma Client from `@/generated/prisma/client`

### Styling
- Tailwind CSS for all styling
- Headless UI for interactive components
- Heroicons for icons
- Framer Motion for animations
- Mobile-first approach

### Forms
- React Hook Form + Zod resolver
- Client-side and server-side validation
- Sonner for toast notifications

### Authentication
- NextAuth v5 with two providers: Admin and Client
- Verify session with `auth()` in Server Components
- `authGuard.ts` to protect Server Actions

### Naming Conventions
- Files: kebab-case (`my-component.tsx`)
- Components: PascalCase (`MyComponent`)
- Functions/variables: camelCase (`myFunction`)
- Types/Interfaces: PascalCase (`MyType`)
- Constants: UPPER_SNAKE_CASE (`MY_CONSTANT`)
- Server Actions: camelCase + Action suffix (`createContactAction`)

### Git
- Descriptive commits in English
- One feature per commit
- DO NOT include mentions of Claude, AI, or "Generated with" in commits
- DO NOT add Co-Authored-By from Claude/Anthropic

---

## Common Imports

```typescript
// Database
import { prisma } from "@/lib/prisma";
import { Payment, Contact, Client, Admin } from "@/generated/prisma/client";

// Auth
import { auth } from "@/lib/auth";
import { requireAdmin, requireClient } from "@/lib/authGuard";

// Types
import type { ActionResult, ActionResultSimple } from "@/types/common";
import type { Milestone, MilestoneStatus } from "@/types/milestone";
import type { ClientProject } from "@/types/client";
import type { ClientDeliverable } from "@/types/deliverable";
import type { CreateMessageData } from "@/types/message";

// Validation
import { z } from "zod";
import { FormSchema, LoginSchema, BlogSubscriptionSchema } from "@/lib/zod";

// Utils
import { formatCurrency, formatDate, generateProjectCode } from "@/lib/utils";
import { genPageMetadata } from "@/utils/genPageMetadata";

// Config
import { siteConfig } from "@/config/site";

// Email
import { sendEmailWithQuota } from "@/lib/sendEmailWithQuota";
import { sendInvoiceEmail } from "@/lib/email/senders";

// UI & Animations
import { motion } from "framer-motion";
import SignOutButton from "@/app/components/ui/SignOutButton";

// Store
import { useRCWebStore } from "@/store/rcweb-store";

// Blog
import { getAllPosts } from "@/lib/blog";
```

---

## Required Environment Variables

```env
# Database
DATABASE_URL=

# Auth
AUTH_SECRET=
AUTH_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Resend (Email)
RESEND_API_KEY=

# Twilio (SMS)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# OpenAI
OPENAI_API_KEY=

# Vercel Blob
BLOB_READ_WRITE_TOKEN=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# URLs
NEXT_PUBLIC_BASE_URL=https://rcweb.dev

# Admin
ADMIN_EMAIL=
```

---

## Important Notes

- **Bilingual:** Site in English, but Hispanic audience in Houston
- **Critical SEO:** Optimize meta tags, structured data, sitemap
- **Performance:** Maintain Lighthouse 90+
- **Target audience:** Small businesses looking for web presence
- **Payment system:** 50% initial, 50% on completion
- **Rate limiting:** Implemented with Upstash for forms and APIs
- **Email quota:** Daily control to avoid Resend limits

---

*Last updated: February 2026*
