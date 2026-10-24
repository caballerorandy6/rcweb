# RC Web Solutions

> Professional web development services platform with integrated marketing automation, payment processing, and customer management.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)
![Prisma](https://img.shields.io/badge/Prisma-6.15-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
- [Development](#development)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [API Routes & Webhooks](#api-routes--webhooks)
- [Deployment](#deployment)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About

**RC Web Solutions** is a comprehensive full-stack web application designed for professional web development services. Built by **Randy Caballero**, a full-stack web developer with 5+ years of experience, this platform serves as the complete business management solution for delivering exceptional digital experiences to clients worldwide.

### Mission
Crafting exceptional digital experiences with modern web technologies. Specializing in creating high-performance, scalable web applications that drive business growth and deliver measurable results.

### What We Offer
As a freelance developer based in Houston, TX, RC Web Solutions provides:
- **Full-Stack Web Applications** with modern frameworks (Next.js, React, TypeScript)
- **High-Converting Landing Pages** optimized for performance (95+ Lighthouse Score)
- **Custom Management Systems** with automation and reporting capabilities
- **Digital Consulting** for web strategy, SEO, and performance optimization

### Why This Platform
This application serves as the central hub for managing client relationships, automating marketing campaigns, processing payments securely, generating invoices, and streamlining business operations. It combines powerful integrations (Stripe, Twilio, Resend, OpenAI) with a clean, maintainable codebase that demonstrates enterprise-level architecture and best practices.

## Features

### 💳 Payment Processing & Invoicing
- Stripe integration with 50/50 split payment model
- Automatic invoice generation with PDF attachments
- Invoice storage on Vercel Blob
- Email delivery with Resend
- Payment tracking and history
- Webhook-based payment confirmation

### 📧 Marketing Automation
- SMS campaigns with Twilio integration
- Email newsletters with Resend
- Automated opt-in/opt-out management
- A2P 10DLC compliance
- Marketing consent tracking (GDPR compliant)
- Batch campaign sending with progress tracking

### 👥 Customer Management (CRM)
- Complete contact database with CRUD operations
- Phone number management (multiple per contact)
- Lead source attribution
- Marketing consent tracking
- Interaction logging (SMS, Email)
- Contact filtering and search

### 🔐 Authentication & Authorization
- NextAuth v5 implementation
- Role-based access control (ADMIN role)
- Secure admin panel with middleware protection
- Session management

### 📊 Admin Dashboard
- Real-time statistics (contacts, emails sent, SMS sent)
- Project management (create, update status, mark complete)
- Campaign creation and monitoring
- Invoice management
- Contact management interface

### 📝 Content Management
- Markdown-based blog system
- Dynamic sitemap generation
- SEO optimization (JSON-LD structured data)
- Legal pages (Privacy Policy, Terms of Service, Refund Policy)

### 🎨 Modern UI/UX
- Fully responsive design (mobile-first)
- Smooth animations with Framer Motion
- Loading states with skeleton screens
- Toast notifications
- Analytics opt-out (Google Consent Mode v2, no cookie banner)
- AI-powered chat assistant (OpenAI)

### 📞 Communication Features
- Twilio Voice integration (IVR system)
- Incoming SMS webhook handler
- Automated responses (START/STOP commands)
- Email templates with React Email

## Tech Stack

### Frontend
- **Framework:** Next.js 15.5 (App Router, React Server Components)
- **UI Library:** React 19.2
- **Styling:** Tailwind CSS 3.4
- **Animations:** Framer Motion 11.15
- **Components:** Headless UI, Hero Icons
- **Forms:** React Hook Form
- **State:** Zustand 5.0

### Backend
- **Runtime:** Node.js 18+
- **Database:** PostgreSQL with Prisma ORM 6.15
- **Authentication:** NextAuth v5 (Auth.js)
- **Validation:** Zod 3.25
- **File Storage:** Vercel Blob

### Integrations
- **SMS:** Twilio (Messaging Service + Voice)
- **Email:** Resend + React Email
- **Payments:** Stripe
- **AI:** OpenAI API (GPT-4)
- **Storage:** Vercel Blob (Invoice PDFs)

### DevOps & Tools
- **Language:** TypeScript 5.9
- **Linting:** ESLint (Next.js config)
- **Package Manager:** npm
- **Version Control:** Git
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **PostgreSQL** database (local or cloud)
- **npm** package manager
- **Twilio account** (for SMS/Voice features)
- **Stripe account** (for payment processing)
- **Resend account** (for transactional emails)
- **OpenAI API key** (for AI chat feature)
- **Vercel account** (for Blob storage and deployment)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/caballerorandy6/rcweb.git
cd rcweb
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
# Edit .env.local with your actual credentials
```

4. **Set up the database:**
```bash
# Generate Prisma client
npx prisma generate

# Apply migrations
npx prisma migrate deploy

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

5. **Run the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Environment Variables

Create a `.env.local` file in the root directory. See `.env.example` for a complete list of required variables.

**Required variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - NextAuth secret key
- `STRIPE_SECRET_KEY` - Stripe API key
- `RESEND_API_KEY` - Resend API key
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_FORWARD_TO_NUMBER` - Personal number (E.164) that receives calls forwarded from the Twilio number
- `SMS_TEST_NUMBERS` - Comma-separated E.164 numbers used by the SMS campaign test mode
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob token

See [.env.example](./.env.example) for detailed documentation of all environment variables.

### Database Setup

The application uses Prisma ORM with PostgreSQL. The schema includes:

- **User** - Admin users with authentication
- **Contact** - Customer contact information
- **ContactPhone** - Phone numbers for contacts
- **Payment** - Payment records with project tracking
- **Invoice** - Generated invoices with PDF links
- **NewsletterLog** - Email campaign tracking
- **SmsLog** - SMS interaction logging

**Database commands:**
```bash
# Generate Prisma Client
npx prisma generate

# Create a migration from schema changes (dev)
npx prisma migrate dev --name <change>

# Apply pending migrations (CI / production)
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

## Development

### Running the Application

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm run start
```

### Email Template Development

Preview and develop email templates:

```bash
npm run email
```

This starts a development server on port 3001 for previewing email templates.

### Development Tools

```bash
# Open Prisma Studio (database GUI)
npx prisma studio

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

## Project Structure

```
rcweb/
├── prisma/
│   └── schema.prisma           # Database schema
├── public/                     # Static assets
│   ├── blog/                  # Blog post markdown files
│   └── fonts/                 # Custom fonts
├── src/
│   ├── actions/               # Server Actions (organized by feature)
│   │   ├── admin/            # Admin-specific actions
│   │   ├── auth/             # Authentication actions
│   │   ├── campaigns/        # Email/SMS campaign actions
│   │   ├── contacts/         # Contact management actions
│   │   ├── payments/         # Payment processing actions
│   │   ├── projects/         # Project management actions
│   │   └── stats/            # Statistics actions
│   ├── app/                  # Next.js App Router
│   │   ├── (admin)/         # Admin panel routes
│   │   ├── api/             # API routes (webhooks)
│   │   ├── blog/            # Blog pages
│   │   └── components/      # React components (organized)
│   │       ├── admin/       # Admin panel components
│   │       ├── Blog/        # Blog components
│   │       ├── forms/       # Form components
│   │       ├── icons/       # Icon components
│   │       ├── layout/      # Layout components
│   │       ├── payment/     # Payment components
│   │       ├── Sections/    # Landing page sections
│   │       ├── seo/         # SEO components (JSON-LD)
│   │       ├── skeletons/   # Loading skeletons
│   │       ├── tracking/    # Analytics components
│   │       └── ui/          # Reusable UI components
│   ├── emails/              # Email templates (React Email)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   │   ├── invoice/        # Invoice generation system
│   │   ├── auth.ts         # NextAuth configuration
│   │   ├── blob.ts         # Vercel Blob utilities
│   │   ├── blog.ts         # Blog utilities
│   │   ├── data.ts         # Static data (navigation, pricing, etc.)
│   │   └── prisma.ts       # Prisma client singleton
│   ├── store/              # Zustand state management
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── .env.example            # Environment variables template
├── .env.local             # Local environment variables (gitignored)
├── CHANGELOG.md           # Version history
├── CONTRIBUTING.md        # Contribution guidelines
├── next.config.ts         # Next.js configuration
└── tsconfig.json          # TypeScript configuration
```

## Documentation

- **[Server Actions](./docs/SERVER_ACTIONS.md)** - Complete documentation of all server actions
- **[Environment Variables](./.env.example)** - Detailed list of environment variables
- **[Changelog](./CHANGELOG.md)** - Version history and release notes

## API Routes & Webhooks

### Public API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/[...nextauth]` | * | NextAuth authentication endpoints |
| `/api/chat` | POST | OpenAI chat endpoint (Edge runtime) |
| `/api/invoice/[invoiceNumber]` | GET | Download invoice PDF by number |
| `/api/twilio/sms/incoming` | POST | Handle incoming SMS messages |
| `/api/twilio/voice` | POST | Handle incoming voice calls (forward + voicemail) |
| `/api/webhooks/stripe` | POST | Stripe payment webhook |

### Webhook Configuration

**Stripe Webhook:**
- URL: `https://rcweb.dev/api/webhooks/stripe`
- Events: `checkout.session.completed`

**Twilio SMS Webhook:**
- URL: `https://rcweb.dev/api/twilio/sms/incoming`
- Method: POST

**Twilio Voice Webhook:**
- URL: `https://rcweb.dev/api/twilio/voice`
- Method: POST

## Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database
npx prisma generate      # Generate Prisma Client
npx prisma migrate deploy  # Apply pending migrations
npx prisma studio        # Open Prisma Studio GUI

# Email Development
npm run email            # Start email template preview server

# Linting & Type Checking
npm run lint             # Run ESLint
npx tsc --noEmit        # Type check without emitting files
```

## Deployment

### Vercel (Recommended)

1. **Push code to GitHub**
2. **Import project in [Vercel](https://vercel.com)**
3. **Configure environment variables** (see .env.example)
4. **Deploy**

### Pre-deployment Checklist

- [ ] Set all environment variables in Vercel
- [ ] Configure PostgreSQL database (Vercel Postgres or external)
- [ ] Set up Vercel Blob storage
- [ ] Configure Stripe webhook URL
- [ ] Configure Twilio webhook URLs (SMS and Voice)
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Test payment flows in Stripe test mode
- [ ] Test SMS opt-in/opt-out functionality
- [ ] Verify all integrations work in production
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Configure custom domain (optional)

### Other Platforms

The application can be deployed to any platform supporting Next.js:
- AWS (Amplify, ECS)
- Google Cloud Platform
- Azure
- Railway
- Render
- Self-hosted with Docker

## About This Project

This is a private, proprietary project developed and maintained by Randy Caballero for freelance web development services. It serves as both a business management platform and a portfolio showcase.

## License

This project is private and proprietary. All rights reserved © 2025 Randy Caballero / RC Web Solutions.

## Contact

### Get in Touch

Have a project in mind? Let's build something amazing together!

**Randy Caballero**
Full-Stack Web Developer
Houston, TX

- 🌐 **Website:** [rcweb.dev](https://rcweb.dev)
- 📧 **Email:** contactus@rcweb.dev
- 📱 **Phone:** (346) 375-7534
- 💼 **LinkedIn:** [linkedin.com/company/rcwebsolutions](https://www.linkedin.com/company/rcwebsolutions)
- 🐙 **GitHub:** [@caballerorandy6](https://github.com/caballerorandy6)

### Business Hours
- Monday - Friday: 9:00 AM - 6:00 PM CST
- Weekend: By appointment only
- **Worldwide remote work available**

### Services & Pricing
Visit [rcweb.dev](https://rcweb.dev) to learn more about:
- Service packages (Basic, Professional, Premium)
- Portfolio and case studies
- Client testimonials
- Free consultation booking

---

**RC Web Solutions** - Crafting Exceptional Digital Experiences

*Built with Next.js 15.5, React 19.2, TypeScript 5.9, PostgreSQL, Prisma, Tailwind CSS, NextAuth, Stripe, Twilio, Resend, OpenAI, and Vercel Blob*
