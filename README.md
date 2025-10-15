# RC Web Solutions

> Professional web development services platform with integrated marketing automation, payment processing, and customer management.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)
![Prisma](https://img.shields.io/badge/Prisma-6.15-2D3748?style=flat-square&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3.25-3E67B1?style=flat-square&logo=zod)
![Zustand](https://img.shields.io/badge/Zustand-5.0-433E38?style=flat-square)

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
- [Key Features](#key-features)
- [API Routes](#api-routes)
- [Deployment](#deployment)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About

**RC Web Solutions** is a comprehensive web application designed for professional web development services. Built by **Randy Caballero**, a full-stack web developer with 5+ years of experience, this platform serves as the backbone for delivering exceptional digital experiences to clients worldwide.

### Mission
Crafting exceptional digital experiences with modern web technologies. Specializing in creating high-performance, scalable web applications that drive business growth and deliver measurable results.

### What We Offer
As a freelance developer based in Houston, TX, RC Web Solutions provides:
- **Full-Stack Web Applications** with modern frameworks (Next.js, React, TypeScript)
- **High-Converting Landing Pages** optimized for performance (95+ Lighthouse Score)
- **Custom Management Systems** with automation and reporting capabilities
- **Digital Consulting** for web strategy, SEO, and performance optimization

### Why This Platform
This application serves as the central hub for managing client relationships, automating marketing campaigns, processing payments securely, and streamlining business operations. It combines powerful integrations (Twilio, Stripe, Resend) with a clean, maintainable codebase that demonstrates enterprise-level architecture and best practices.

### Development Approach
- Transparent development process with weekly demos
- Worldwide remote collaboration
- Flexible pricing plans (Starter, Growth, Premium)
- 30 days free post-launch support included

## Features

- **Marketing Automation**
  - SMS campaigns with Twilio integration
  - Email campaigns with Resend
  - Automated opt-in/opt-out management
  - A2P 10DLC compliance

- **Customer Management**
  - Contact database with marketing consent tracking
  - Phone number management
  - Lead source attribution
  - Interaction logging

- **Payment Processing**
  - Stripe integration for secure payments
  - Multiple payment flows (initial, final, custom)
  - Payment tracking and history
  - Automated payment confirmations

- **Authentication & Authorization**
  - NextAuth v5 implementation
  - Role-based access control
  - Secure admin panel

- **Content Management**
  - Blog system
  - Legal pages (Privacy Policy, Terms of Service, Refund Policy)
  - Dynamic sitemap generation
  - SEO optimization

## Tech Stack

### Frontend
- **Framework:** Next.js 15.5 (App Router)
- **UI Library:** React 19.2
- **Styling:** Tailwind CSS 3.4
- **Animations:** Framer Motion
- **Components:** Headless UI, Hero Icons
- **Forms:** React Hook Form + Zod validation

### Backend
- **Runtime:** Node.js
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth v5
- **File Storage:** Local/Cloud storage support

### Integrations
- **SMS:** Twilio (Messaging Service + Webhooks)
- **Email:** Resend + React Email
- **Payments:** Stripe
- **AI:** OpenAI API

### DevOps
- **Language:** TypeScript 5.9
- **Linting:** ESLint (Next.js config)
- **Package Manager:** npm/yarn/pnpm
- **Version Control:** Git

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL database
- npm/yarn/pnpm package manager
- Twilio account (for SMS features)
- Stripe account (for payments)
- Resend account (for email)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/caballerorandy6/rcweb.git
cd rcweb
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/rcweb"

# NextAuth
AUTH_SECRET="your-auth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Twilio
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"
TWILIO_MESSAGING_SERVICE_SID="your-messaging-service-sid"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"

# Resend
RESEND_API_KEY="your-resend-api-key"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"
```

### Database Setup

1. Generate Prisma client:
```bash
npx prisma generate
```

2. Run database migrations:
```bash
npx prisma db push
```

3. (Optional) Seed the database:
```bash
npm run seed
```

## Development

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The application uses hot-reload, so changes will be reflected automatically.

### Email Development

Run the email development server:

```bash
npm run email
```

This starts a local server on port 3001 for previewing email templates.

## Project Structure

```
rcweb/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding
├── public/                # Static assets
├── scripts/               # Utility scripts
│   ├── diagnose-sms.ts   # SMS diagnostics
│   └── test-twilio.ts    # Twilio testing
├── src/
│   ├── actions/          # Server actions
│   │   ├── sendSMSCampaignAction.ts
│   │   └── sendEmailCampaignAction.ts
│   ├── app/              # Next.js App Router
│   │   ├── (admin)/     # Admin routes
│   │   ├── api/         # API routes
│   │   ├── blog/        # Blog pages
│   │   ├── components/  # Shared components
│   │   └── page.tsx     # Home page
│   ├── lib/             # Utility functions
│   └── types/           # TypeScript types
├── .env                  # Environment variables
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies
```

## Key Features

### SMS Marketing System

The platform includes a complete SMS marketing automation system:

- **Automated Opt-in/Opt-out:** Users can text START/STOP to subscribe/unsubscribe
- **Webhook Handler:** `/api/twilio/sms/incoming` processes incoming messages
- **Campaign Management:** Send bulk SMS campaigns to opted-in contacts
- **Compliance:** A2P 10DLC compliant with proper consent tracking
- **Logging:** All SMS interactions logged in `SmsLog` table

### Payment Processing

Multiple payment flows integrated with Stripe:

- Initial deposit payments
- Final balance payments
- Custom payment amounts
- Automated confirmation emails
- Payment history tracking

### Admin Dashboard

Secure admin panel with:

- Contact management
- Campaign creation and monitoring
- Payment tracking
- Analytics and reporting

## API Routes

### Twilio Webhooks
- `POST /api/twilio/sms/incoming` - Handle incoming SMS messages
- `GET /api/twilio/sms/incoming` - Webhook health check

### Authentication
- NextAuth v5 authentication endpoints

### Stripe
- Payment processing endpoints
- Webhook handlers for payment events

## Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run seed         # Seed database with sample data
npx prisma studio    # Open Prisma Studio (database GUI)

# Testing
npm run test:twilio  # Test Twilio integration
npm run test:webhook # Test webhook endpoint

# Email
npm run email        # Start email development server

# Linting
npm run lint         # Run ESLint
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Vercel
- AWS (Amplify, ECS, EC2)
- Google Cloud Platform
- Azure
- Railway
- Render
- Self-hosted

### Important Pre-deployment Checklist

- [ ] Set all environment variables
- [ ] Run database migrations
- [ ] Configure Twilio webhook URL
- [ ] Set up Stripe webhook endpoints
- [ ] Update NextAuth URL to production domain
- [ ] Configure domain DNS settings
- [ ] Enable HTTPS
- [ ] Test payment flows
- [ ] Test SMS opt-in/opt-out

## Environment Setup Notes

### Twilio Configuration

1. Configure webhook in [Twilio Console](https://console.twilio.com):
   - Navigate to Phone Numbers > Manage > Active Numbers
   - Select your number
   - Under "Messaging Configuration", set:
     - **Webhook URL:** `https://rcweb.dev/api/twilio/sms/incoming`
     - **HTTP Method:** POST

2. Complete A2P 10DLC campaign registration for compliance

### Stripe Configuration

1. Set up webhook endpoints in [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Configure payment success/cancel URLs
3. Test in Stripe test mode before going live

## Contributing

This is a private, proprietary project developed and maintained by Randy Caballero. While this is not an open-source project, feedback and suggestions are always welcome!

### Reporting Issues
If you're a collaborator or have been granted access:
1. Report bugs or suggest features through GitHub Issues
2. Provide detailed descriptions with screenshots if applicable
3. Include steps to reproduce for bugs

### For Potential Collaborators
Interested in working together? Reach out through:
- Website: [rcweb.dev](https://rcweb.dev)
- Email: Contact form on website
- LinkedIn: Professional inquiries welcome

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
- Service packages (Starter, Growth, Premium)
- Portfolio and case studies
- Client testimonials
- Free consultation booking

---

**RC Web Solutions** - Crafting Exceptional Digital Experiences

*Built with Next.js 15.5, React 19.2, TypeScript 5.9, PostgreSQL, Prisma, Tailwind CSS, NextAuth, Twilio, Stripe, Resend, and Zustand*
