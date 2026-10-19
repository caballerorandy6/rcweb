# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Owners of small local businesses in the Houston area — clinics, salons, contractors, restaurants, logistics — many of them Spanish-speaking. They arrive with no website, or with an old one that brings no customers, and they want calls and appointments, not technology. They judge the site on their phone, in a spare minute, and decide whether to contact a person.

Secondary: the same owners after the project, following progress through a private link and paying by link; no accounts, no portal.

## Product Purpose

RC Web Solutions (rcweb.dev) is the public site of a one-person web studio run by Randy Caballero. It sells custom websites, redesigns, admin dashboards, online stores/custom apps and monthly maintenance to those owners, and must turn a visit into a contact. Success is a potential client reaching out: the primary action is "Schedule a Free Call" (Calendly); the contact form, a phone call and WhatsApp count equally and all four must be measured.

## Positioning

- Direct relationship with the developer: the person you talk to designs, builds and maintains the site. No account managers.
- Genuinely bilingual: service and sites in Spanish and English from a native Spanish speaker.
- Measured results in the Houston Hispanic market: for a network of 17 clinics, monthly clicks from Google went from 106 to 1,041 (May–Sep 2026) and calls from Google and the website rose 49 %.
- The work does not end at delivery: the site, its local SEO and the Google Business Profile keep being looked after.

## Operating Context

- Visitors come from Google (local searches), the Google Business Profile, referrals and campaigns; most on mobile.
- Contact paths: Calendly, contact form (email + SMS consent under TCPA wording), phone +1 (346) 375-7534, WhatsApp, and an AI chat assistant on the site.
- After the sale: the admin creates a payment, the client pays 50 % by Stripe link (`/pay/[token]`), follows the project at `/project/[accessToken]`, pays the remaining 50 % on delivery. From 2026, installments for projects ≥ $3,000 are planned (etapa 4).
- Email/SMS campaigns to opted-in contacts (Resend, Twilio 10DLC); no offers or discounts, by decision.

## Capabilities and Constraints

- Next.js 16 App Router, React 19, Tailwind 4, Prisma 7 on Postgres, Stripe, Resend, Twilio, Sentry; Node runtime on Vercel. Headless UI for interactive components, Heroicons, no shadcn.
- One role (admin). There is no client portal and no registered clients: token links only. Do not design account flows.
- Prices are fixed and not to be raised or lowered: Business Website from $1,000, Redesign $3,500, Admin Dashboard $7,500, Online Store & Custom Apps $8,000, Maintenance $200/month. Only the landing-page plan and maintenance are purchasable online; the rest go to a quote call.
- Blog: Markdown in `content/blog/` (12 posts), categories derived from tags.
- Site is English-first; bilingual delivery is a service, not a UI toggle (undecided: whether rcweb.dev itself gets a Spanish version).
- No promotions, countdowns, "special offers" or urgency devices anywhere.

## Brand Commitments

- Name: RC Web Solutions LLC; short form "RC Web". Houston, TX (Missouri City address on legal pages).
- Voice: first person singular (Randy speaking), decided in 2026-10; plain, specific, no unverifiable promises (no "sub-second", no "95+ Lighthouse", no "24/7").
- Visual identity to preserve, not redesign: dark navy background (gray-900/950), gold accent `#cbb26a`, Iceland (single 400 weight, only for headings ≥ 24 px) and Inter for everything else. Documented in DESIGN.md when generated.

## Evidence on Hand

- Portfolio: 7 real client sites (GSM A/C, Dulce Antojo, Clínica Gessner, Airline, Leo's Home Experts, RC Beauty Salon, Limo Renting) in `src/lib/data.ts`; case studies for GSM and Dulce Antojo.
- Three Google reviews (Michel Chapelli / GSM A/C, Leonardo Lecour Acosta / Leo's Home Experts, Yoannis Aguilar Fonseca) rendered statically until the Business Profile API access is granted.
- Clinic-network results above (stated by Randy on 2026-10-19; underlying Search Console / call data not yet in the repo — obtain it before publishing the numbers on the site).
- Absent, do not fabricate: client logos beyond the portfolio, press, awards, certifications beyond those listed on /about, team members.

## Product Principles

1. Every surface exists to make contact easy: the four contact paths stay visible and measurable.
2. Say only what can be shown: real projects, real reviews, real numbers with a source.
3. Built for the owner on a phone: fast, legible, bilingual-ready, no jargon.
4. One person behind the work: the site should feel like talking to Randy, not to an agency.
5. Keep what is bought simple: fixed prices, 50/50 by link, no accounts, no offers.

## Accessibility & Inclusion

Target WCAG 2.2 AA on the public site (contrast ≥ 4.5:1 for text, keyboard-operable dialogs and menus, labelled form fields, reduced-motion respected). Many visitors read Spanish first: keep copy short and concrete.
