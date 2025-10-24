# Changelog

All notable changes to RC Web Solutions will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Complete documentation suite (README, CONTRIBUTING, SERVER_ACTIONS.md, .env.example)

## [1.1.0] - 2025-01-24

### Added
- **Project Reorganization**: Complete restructuring of codebase for better maintainability
  - Actions organized into feature folders: `auth/`, `campaigns/`, `contacts/`, `payments/`, `projects/`, `stats/`, `admin/`
  - Components organized into themed folders: `admin/`, `forms/`, `payment/`, `skeletons/`, `seo/`, `tracking/`, `layout/`, `ui/`
  - Server actions converted from API routes for 30-50% better performance
- **Admin Actions**: New server actions for admin operations
  - `processPendingInvoicesAction` - Process all pending invoices
  - `updateProjectStatusAction` - Update project status with automatic email notifications

### Changed
- Updated project structure with feature-based organization
- Migrated 2 API routes to server actions for better type-safety and performance
- Updated 67+ files with new import paths
- Improved code organization and separation of concerns

### Removed
- Deleted unused `updateStatusAction.ts`
- Removed empty `lib/scripts/` folder
- Deleted unused `Welcome.tsx` email template
- Removed redundant admin API routes (converted to server actions)

### Fixed
- Cleaned up console.log statements across codebase (kept console.error/warn)
- Fixed ESLint errors for unused variables
- Updated all import paths to match new structure

## [1.0.0] - 2025-01-15

### Added
- **Invoice System**: Complete automated invoice generation and delivery
  - PDF generation with custom templates
  - Automatic email delivery with Resend
  - Vercel Blob storage integration
  - Three types: initial, final, and summary invoices
  - Webhook-triggered invoice creation from Stripe payments
- **Blog System**: Markdown-based CMS
  - Dynamic blog post pages
  - Author information and reading time
  - SEO optimization with JSON-LD
  - Automatic sitemap generation
- **Payment System**: Stripe integration with split payments
  - 50/50 payment model (initial deposit + final payment)
  - Secure checkout sessions
  - Payment tracking and history
  - Automated confirmation emails
  - Webhook handlers for payment events
- **Admin Panel**: Complete dashboard for business management
  - Contact management (CRUD operations)
  - Project tracking and status updates
  - Campaign creation (Email & SMS)
  - Real-time statistics
  - Secure authentication with NextAuth v5
- **Marketing Automation**: Multi-channel campaigns
  - Email newsletters with Resend
  - SMS campaigns with Twilio
  - Automated opt-in/opt-out management
  - A2P 10DLC compliance
  - Campaign logging and analytics
- **CRM Features**: Customer relationship management
  - Contact database with phone numbers
  - Marketing consent tracking (GDPR compliant)
  - Lead source attribution
  - Interaction logging
- **Communication**: Twilio Voice & SMS integration
  - Incoming SMS webhook handler
  - Automated responses (START/STOP/HELP)
  - IVR system for voice calls
  - Call completion tracking
- **AI Chat**: OpenAI-powered assistant
  - Real-time chat interface
  - Context-aware responses about services
  - Edge runtime for faster responses
- **SEO**: Comprehensive search engine optimization
  - Dynamic sitemap generation
  - JSON-LD structured data (Organization, LocalBusiness, FAQ, Product, Article, Breadcrumb)
  - Meta tags optimization
  - Open Graph and Twitter Cards
- **Analytics**: Multi-platform tracking
  - Google Analytics 4 integration
  - Facebook Pixel
  - LinkedIn Insight Tag
  - Google Tag Manager
- **UI/UX Improvements**: Modern, responsive design
  - Framer Motion animations
  - Loading skeleton screens
  - Toast notifications with Sonner
  - Cookie consent management
  - Scroll spy navigation
  - Responsive mobile-first design

### Technical Implementation
- **Framework**: Next.js 15.5 with App Router
- **Language**: TypeScript 5.9
- **Database**: PostgreSQL with Prisma ORM 6.15
- **Authentication**: NextAuth v5
- **Styling**: Tailwind CSS 3.4
- **State Management**: Zustand 5.0
- **Validation**: Zod 3.25
- **Email**: Resend + React Email
- **Storage**: Vercel Blob
- **Payments**: Stripe
- **Communications**: Twilio (SMS + Voice)
- **AI**: OpenAI API

### Security
- Role-based access control (RBAC)
- Protected routes with middleware
- Secure session management
- CSRF protection with NextAuth
- Input validation with Zod
- SQL injection protection with Prisma
- Webhook signature verification (Stripe, Twilio)

## [0.1.0] - 2024-10-01

### Added
- Initial project setup
- Basic landing page
- Contact form
- Email integration with Resend
- PostgreSQL database with Prisma

---

## Version Numbering

- **Major (X.0.0)**: Breaking changes, major new features
- **Minor (0.X.0)**: New features, backward compatible
- **Patch (0.0.X)**: Bug fixes, minor improvements

## Upgrade Notes

### From 1.0.0 to 1.1.0

No breaking changes. The reorganization maintains all existing functionality:

1. **Actions imports**: If you have custom code importing actions, update paths:
   ```typescript
   // Old
   import { sendNewsletterAction } from '@/actions/sendNewsletterAction'

   // New
   import { sendNewsletterAction } from '@/actions/campaigns/sendNewsletterAction'
   ```

2. **Component imports**: Update component import paths:
   ```typescript
   // Old
   import Navbar from '@/app/components/Navbar'

   // New
   import Navbar from '@/app/components/layout/Navbar'
   ```

3. **No database changes required**
4. **No environment variable changes required**
5. **API routes unchanged** - All webhooks work with same URLs

## Links

- [Repository](https://github.com/caballerorandy6/rcweb)
- [Documentation](./README.md)
- [Website](https://rcweb.dev)

---

**RC Web Solutions** - Crafting Exceptional Digital Experiences
