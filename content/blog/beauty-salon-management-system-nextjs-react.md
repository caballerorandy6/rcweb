---
title: "Building a Beauty Salon Management System with Next.js 15 & React 19"
description: "A comprehensive case study on building a full-stack beauty salon management platform featuring online booking with Stripe payments, admin dashboard, staff portal, e-commerce shop, and automated notifications using Next.js 15, React 19, TypeScript, and PostgreSQL."
date: "2025-12-09"
author: "Randy Caballero"
image: "/og-image.jpg"
tags: ["Next.js", "React 19", "TypeScript", "Full Stack Development", "Case Study", "SaaS", "Stripe"]
---

# Building a Beauty Salon Management System with Next.js 15 & React 19

We're currently developing RC Beauty Salon, a full-stack web application designed to digitize the operations of a professional beauty salon. The system integrates online booking, inventory management, payment processing, and automated customer communication. The project is approximately 80% complete, with core functionality fully operational.

---

## Project Overview

In the beauty industry, managing appointments, staff schedules, inventory, and customer relationships manually leads to missed bookings, double-bookings, and lost revenue. Our solution provides a comprehensive digital platform that automates these processes while delivering an exceptional customer experience.

**Key business challenges solved:**
- **Online booking** - Customers can book 24/7 without calling
- **Payment processing** - Secure deposits reduce no-shows
- **Staff management** - Each professional manages their own schedule
- **Inventory control** - Track products and enable e-commerce sales
- **Customer retention** - Reviews, automated emails, and account management

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router + Turbopack) |
| UI Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Radix UI |
| Icons | Phosphor Icons |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | NextAuth.js v5 (Beta) |
| Payments | Stripe |
| Emails | Resend + React Email |
| State Management | Zustand |
| Validation | Zod + React Hook Form |
| Image Hosting | Cloudinary |
| Date Handling | date-fns |
| Notifications | Sonner |
| Theming | next-themes |

---

## Application Architecture

### Route Groups Structure

We leveraged Next.js 15 Route Groups to organize the application by user roles:

```
src/app/
├── (public)/          # Public pages (landing, services, staff)
├── (auth)/            # Login, register, password reset
├── (customer)/        # Customer portal (appointments, orders, account)
├── (staff)/           # Staff portal
├── (admin)/           # Admin dashboard
└── api/               # API routes and webhooks
```

This structure provides clear separation of concerns and makes it easy to apply layouts and middleware to specific user roles.

### Server Actions

We implemented 103 Server Actions to handle all server-side logic, eliminating the need for traditional API routes for CRUD operations:

```typescript
// Example: Server Action for creating appointments
export async function createAppointment(data: AppointmentFormData) {
  const session = await auth()

  // Zod validation
  const validated = appointmentSchema.parse(data)

  // Check staff availability
  const isAvailable = await checkStaffAvailability(
    validated.staffId,
    validated.date,
    validated.time
  )

  if (!isAvailable) {
    return { success: false, error: "Time slot not available" }
  }

  // Create appointment in database
  const appointment = await prisma.appointment.create({
    data: validated
  })

  // Send confirmation email
  await sendAppointmentConfirmation(appointment)

  // Revalidate cache
  revalidatePath('/appointments')

  return { success: true, appointment }
}
```

**Benefits of Server Actions:**
- Type-safe end-to-end
- No API route boilerplate
- Automatic request handling
- Built-in revalidation

---

## Core Features

### 1. Booking System

The booking flow implements a 4-step process:

1. **Service Selection** - Categories and services with pricing
2. **Professional Selection** - Available staff for the chosen service
3. **Date & Time** - Available slots based on working hours
4. **Confirmation & Payment** - $50 deposit via Stripe

```typescript
// Booking flow with state management
const useBookingStore = create<BookingState>((set) => ({
  step: 1,
  selectedService: null,
  selectedStaff: null,
  selectedDate: null,
  selectedTime: null,

  setService: (service) => set({ selectedService: service, step: 2 }),
  setStaff: (staff) => set({ selectedStaff: staff, step: 3 }),
  setDateTime: (date, time) => set({
    selectedDate: date,
    selectedTime: time,
    step: 4
  }),
  reset: () => set({ step: 1, selectedService: null, ... })
}))
```

### 2. Stripe Integration

We implemented webhooks to handle payment events for both appointment deposits and product purchases:

```typescript
// src/app/api/webhooks/stripe/route.ts
export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )

  switch (event.type) {
    case 'checkout.session.completed':
      await handleSuccessfulPayment(event.data.object)
      break
    case 'payment_intent.payment_failed':
      await handleFailedPayment(event.data.object)
      break
  }

  return NextResponse.json({ received: true })
}
```

**Payment features:**
- Secure checkout with Stripe Elements
- Webhook handling for payment confirmation
- Automatic appointment status updates
- Email receipts and confirmations

### 3. Transactional Email System

We use React Email to create typed, reusable templates with 10 different email types:

- Appointment confirmation
- Appointment reminder (24h before)
- Appointment cancelled
- Appointment rescheduled
- Appointment completed
- No-show notification
- Email verification
- Password reset
- Account activated
- Order confirmation

```typescript
// Email template with React Email
export const AppointmentConfirmation = ({
  customerName,
  serviceName,
  staffName,
  date,
  time,
}: AppointmentEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Appointment Confirmed!</Heading>
        <Text style={text}>
          Hi {customerName}, your {serviceName} appointment
          with {staffName} is confirmed for {date} at {time}.
        </Text>
        <Button style={button} href={appointmentUrl}>
          View Appointment
        </Button>
      </Container>
    </Body>
  </Html>
)
```

### 4. Role-Based Access Control

Three user roles with specific permissions:

| Role | Permissions |
|------|-------------|
| ADMIN | Full system access, dashboard, settings, reports |
| STAFF | Personal appointments, schedule, profile, availability |
| CUSTOMER | Booking, orders, reviews, account management |

```typescript
// Middleware for role-based access
export default auth((req) => {
  const { pathname } = req.nextUrl
  const role = req.auth?.user?.role

  if (pathname.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (pathname.startsWith('/staff') && !['ADMIN', 'STAFF'].includes(role)) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
})
```

### 5. E-Commerce Shop

Full shopping experience with:

- Product catalog with categories
- Shopping cart with Zustand persistence
- Secure checkout with Stripe
- Order history and tracking
- Inventory management

```typescript
// Cart store with localStorage persistence
const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const items = get().items
        const existing = items.find(i => i.id === product.id)

        if (existing) {
          set({
            items: items.map(i =>
              i.id === product.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          })
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] })
        }
      },
      removeItem: (id) => set({
        items: get().items.filter(i => i.id !== id)
      }),
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
      )
    }),
    { name: 'cart-storage' }
  )
)
```

### 6. React 19 Features

We leverage `useTransition` for non-blocking UI updates during server mutations:

```typescript
const [isPending, startTransition] = useTransition()

const handleStatusChange = (newStatus: string) => {
  startTransition(async () => {
    const result = await updateAppointmentStatus(id, newStatus)
    if (result.success) {
      toast.success("Status updated")
    }
  })
}

return (
  <Button
    onClick={() => handleStatusChange('completed')}
    disabled={isPending}
  >
    {isPending ? <Spinner /> : 'Complete'}
  </Button>
)
```

**Benefits:**
- UI remains responsive during updates
- Built-in loading states
- No external state management needed for async operations

---

## Data Model

The Prisma schema includes 20 interconnected models:

```prisma
// Core models overview
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  role      Role     @default(CUSTOMER)
  customer  Customer?
  staff     Staff?
}

model Appointment {
  id          String   @id @default(cuid())
  status      AppointmentStatus
  date        DateTime
  customer    Customer @relation(...)
  staff       Staff    @relation(...)
  services    AppointmentService[]
  payment     Payment?
}

model Service {
  id          String   @id @default(cuid())
  name        String
  price       Decimal
  duration    Int      // minutes
  category    ServiceCategory @relation(...)
  staff       StaffService[]
}

model Product {
  id          String   @id @default(cuid())
  name        String
  price       Decimal
  stock       Int
  category    ProductCategory @relation(...)
  orders      OrderItem[]
}
```

**Complete model list:**
- User, Account, Session (Auth)
- Customer, Staff, WorkingHours
- Service, ServiceCategory, StaffService
- Appointment, AppointmentService
- Product, ProductCategory, Order, OrderItem
- Review, Cart, CartItem
- SalonConfig, VerificationToken

---

## Optimizations Implemented

### Performance

- **Server Components by default** - Reduced client JavaScript
- **Turbopack** - 10x faster development builds
- **Image optimization** - next/image with Cloudinary
- **Database indexing** - Optimized queries on foreign keys

### User Experience

- **useTransition** - Non-blocking mutations
- **Skeleton loaders** - Content structure while loading
- **Real-time validation** - React Hook Form + Zod
- **Toast notifications** - Sonner for feedback
- **Dark mode** - next-themes with system preference

### SEO

- **Metadata API** - Dynamic meta tags per page
- **Semantic URLs** - /services/haircut, /staff/maria
- **Structured data** - JSON-LD for services and business

---

## Project Metrics

| Metric | Value |
|--------|-------|
| Lines of code | ~31,000 |
| React Components | 171 |
| Server Actions | 103 |
| Prisma Models | 20 |
| Email Templates | 10 |
| Project Status | 80% Complete |

---

## What's Left (20%)

The remaining work includes:

### Critical
- **SMS Notifications** - Twilio integration for appointment reminders
- **Balance Payment Collection** - Collect remaining balance before appointments
- **Cron Jobs** - Automated reminder scheduling

### Important
- **Staff blackout dates** - Vacation and day-off management
- **Advanced Analytics** - Revenue reports and insights
- **Low stock alerts** - Inventory notifications

---

## Admin Dashboard Features

The admin dashboard provides:

- **Overview cards** - Today's appointments, revenue, new customers
- **Appointment calendar** - Visual schedule management
- **Staff management** - Add/edit staff, set working hours
- **Service management** - Categories, pricing, durations
- **Product inventory** - Stock levels, categories, pricing
- **Customer database** - Contact info, appointment history
- **Order management** - E-commerce order processing
- **Review moderation** - Approve/reject customer reviews
- **Settings** - Salon configuration, business hours

---

## Staff Portal Features

Each staff member has access to:

- **Personal schedule** - View upcoming appointments
- **Availability settings** - Set working hours
- **Customer notes** - Add notes to appointments
- **Performance stats** - Appointments completed, revenue generated
- **Profile management** - Bio, photo, specialties

---

## Customer Portal Features

Customers can:

- **Book appointments** - Full booking flow with payment
- **Manage appointments** - View, reschedule, cancel
- **Shop products** - Browse, cart, checkout
- **View orders** - Order history and status
- **Leave reviews** - Rate services and staff
- **Manage account** - Profile, password, preferences

---

## Key Takeaways

### 1. Server Actions Simplify Full-Stack Development

No more API routes for basic CRUD. Server Actions with Zod validation provide type-safe, secure mutations with minimal boilerplate.

### 2. Role-Based Architecture Scales

Using Route Groups to separate admin, staff, and customer areas makes the codebase maintainable and secure.

### 3. Zustand + Persist for Client State

Complex client state like shopping carts benefit from Zustand's simplicity with built-in persistence to localStorage.

### 4. React Email for Beautiful Transactional Emails

Building emails with React components is faster and more maintainable than traditional template engines.

### 5. Stripe Webhooks Are Essential

Never rely on client-side payment confirmation. Webhooks ensure payment status is always accurate.

---

## Want to Build Something Similar?

This architecture is perfect for:
- Beauty salons and spas
- Barbershops
- Medical and dental clinics
- Fitness studios and gyms
- Any appointment-based business

If you need a custom booking and management system, [let's talk](/#contact)! I can help you:
- Design a system tailored to your business
- Integrate with your existing tools
- Build a modern, responsive platform
- Deploy to production
- Train your team

---

## Conclusion

Building this beauty salon management system demonstrates how Next.js 15 with the App Router and React 19 enables building complex enterprise applications with a clean and maintainable architecture. The combination of Server Components, Server Actions, and TypeScript provides an exceptional developer experience while delivering a fast and secure application to end users.

The 80% completion milestone shows that a full-featured SaaS platform can be built efficiently with modern tools. The remaining 20% focuses on automation (SMS, cron jobs) and advanced features (analytics, balance collection) that will complete the production-ready system.

---

**Interested in a similar solution for your business?**

Contact us at [contactus@rcweb.dev](mailto:contactus@rcweb.dev) to discuss your project.

---

*RC Web Solutions LLC - Transforming ideas into digital solutions*
