# RC Web Solutions - rcweb.dev

## Sobre el Proyecto
Sitio web profesional de RC Web Solutions LLC, empresa de desarrollo web fundada por Randy Caballero. Ofrece servicios de desarrollo web para pequeños negocios y emprendedores en Houston, TX.

---

## Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript (estricto) |
| Styling | Tailwind CSS |
| UI Components | Headless UI + Heroicons |
| Animaciones | Framer Motion |
| Base de datos | PostgreSQL + Prisma ORM |
| Estado global | Zustand |
| Formularios | React Hook Form + Zod |
| Autenticación | NextAuth v5 (beta) |
| Pagos | Stripe |
| Email | Resend + React Email |
| SMS | Twilio |
| AI | OpenAI |
| Storage | Vercel Blob |
| Rate Limiting | Upstash Redis |
| Analytics | Vercel Analytics |
| Hosting | Vercel |
| Dominio | rcweb.dev |

---

## Estructura del Proyecto

```
src/
├── app/                      # App Router
│   ├── (admin)/              # Grupo de rutas admin (protegidas)
│   ├── admin/                # Login de admin
│   ├── api/                  # API Routes
│   │   ├── auth/[...nextauth]
│   │   ├── chat/
│   │   ├── blog/
│   │   └── email-webhook/
│   ├── blog/                 # Blog público + [slug]
│   ├── client/               # Portal de clientes (autenticado)
│   ├── project/[accessToken] # Vista pública de proyecto
│   ├── pay/[token]           # Página de pago Stripe
│   ├── components/           # Componentes React
│   │   ├── ui/               # Componentes base
│   │   ├── forms/            # Formularios
│   │   ├── sections/         # Secciones de landing
│   │   ├── layout/           # Header, Footer, etc.
│   │   ├── admin/            # Componentes del admin
│   │   ├── client/           # Componentes del portal cliente
│   │   ├── blog/             # Componentes del blog
│   │   ├── payment/          # Componentes de pago
│   │   ├── auth/             # Componentes de autenticación
│   │   ├── icons/            # Iconos custom
│   │   ├── seo/              # Meta tags, structured data
│   │   ├── tracking/         # Analytics
│   │   ├── skeletons/        # Loading states
│   │   └── wrappers/         # HOCs y wrappers
│   ├── schedule/             # Agendar consulta
│   ├── offer/                # Ofertas especiales
│   ├── guide/                # Guía descargable
│   ├── login/                # Login de clientes
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
├── lib/                      # Utilidades core
│   ├── prisma.ts
│   ├── auth.ts
│   ├── authGuard.ts
│   ├── rateLimit.ts
│   ├── zod.ts
│   ├── blob.ts
│   ├── blog.ts
│   ├── email/
│   └── invoice/
├── emails/                   # Templates React Email
├── config/                   # Configuraciones
├── types/                    # TypeScript types/interfaces
├── utils/                    # Utilidades generales
└── generated/                # Prisma Client generado
```

---

## Modelos de Base de Datos (Prisma)

### CRM y Contactos
- `Contact` - Contactos con lead nurturing
- `ContactEmail` - Emails de contacto
- `ContactPhone` - Teléfonos de contacto
- `ContactActivity` - Log de actividades

### Usuarios
- `Admin` - Administradores del sistema
- `Client` - Clientes del portal
- `User` - Usuarios generales

### Proyectos y Pagos
- `Payment` - Proyectos con sistema de pagos 50/50
- `Milestone` - Hitos del proyecto
- `MilestoneNotification` - Notificaciones de hitos
- `Deliverable` - Entregables del proyecto
- `Invoice` - Facturas PDF
- `TermsAcceptance` - Aceptación de términos

### Suscripciones
- `Subscription` - Suscripciones mensuales (mantenimiento)

### Mensajería
- `ProjectMessage` - Mensajes cliente ↔ admin
- `ProjectMessageAttachment` - Archivos adjuntos

### Marketing
- `EmailCampaign` - Campañas de email
- `CampaignEmailLog` - Log de emails enviados
- `DailyEmailQuota` - Control de cuota diaria
- `SmsCampaign` - Campañas SMS
- `SmsLog` - Log de SMS

### Blog
- `BlogSubscriber` - Suscriptores del blog
- `NotifiedBlogPost` - Posts notificados

---

## Comandos Principales

```bash
# Desarrollo
npm run dev              # Desarrollo local (localhost:3000)
npm run build            # Build de producción
npm run start            # Iniciar build
npm run lint             # ESLint

# Base de datos
npx prisma studio        # GUI de base de datos
npx prisma db push       # Sincronizar schema
npx prisma generate      # Generar Prisma Client
npm run migrate          # Migración de desarrollo
npm run seed             # Seed de datos

# Email
npm run email            # Preview de emails (puerto 3001)

# Testing
npm run test:twilio      # Test de Twilio
npm run test:webhook     # Test de webhooks
```

---

## Flujos Críticos

### 1. Proceso de Pago (50/50)
```
Admin crea Payment → Cliente recibe email con link
→ Cliente acepta términos → Stripe Checkout (50%)
→ Webhook procesa pago → Invoice PDF generado
→ Email con factura → Proyecto inicia
→ Admin marca "ready" → Email de pago final
→ Cliente paga 50% restante → Proyecto completado
```

### 2. Portal de Cliente
```
Cliente recibe email de setup → Establece contraseña
→ Login en /client → Dashboard con proyectos
→ Ve milestones, deliverables, invoices
→ Puede enviar mensajes al admin
→ Descarga entregables cuando proyecto completa
```

### 3. Sistema de Mensajes
```
Cliente o Admin escribe mensaje
→ Server Action guarda en DB
→ Email de notificación al destinatario
→ Mensajes marcados como leídos
```

### 4. Lead Nurturing
```
Contacto llega (form, SMS) → Status: NEW
→ Admin gestiona en CRM
→ Actividades logueadas
→ Campañas de email/SMS
```

### 5. Blog
```
MDX en /content/blog → Renderizado con gray-matter
→ Suscriptores reciben notificación
→ Unsubscribe con token
```

---

## Reglas para Claude

### Código
- Siempre TypeScript, nunca JavaScript
- Server Components por defecto
- `'use client'` solo cuando sea estrictamente necesario
- Server Actions para mutaciones (están en `/src/actions/`)
- Validar inputs con Zod siempre
- Manejar errores con try/catch
- Usar Prisma Client de `@/generated/prisma/client`

### Estilo
- Tailwind CSS para todo el styling
- Headless UI para componentes interactivos
- Heroicons para iconos
- Framer Motion para animaciones
- Mobile-first approach

### Formularios
- React Hook Form + Zod resolver
- Validación client-side y server-side
- Sonner para toast notifications

### Autenticación
- NextAuth v5 con dos providers: Admin y Client
- Verificar sesión con `auth()` en Server Components
- `authGuard.ts` para proteger Server Actions

### Convenciones de Nombres
- Archivos: kebab-case (`my-component.tsx`)
- Componentes: PascalCase (`MyComponent`)
- Funciones/variables: camelCase (`myFunction`)
- Types/Interfaces: PascalCase (`MyType`)
- Constantes: UPPER_SNAKE_CASE (`MY_CONSTANT`)
- Server Actions: camelCase + Action suffix (`createContactAction`)

### Git
- Commits descriptivos en inglés
- Una feature por commit
- NO incluir menciones a Claude, AI, o "Generated with" en los commits
- NO agregar Co-Authored-By de Claude/Anthropic

---

## Imports Comunes

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

// Validación
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

## Variables de Entorno Requeridas

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
NEXT_PUBLIC_SITE_URL=https://rcweb.dev
```

---

## Notas Importantes

- **Bilingüe:** Sitio en inglés, pero audiencia hispana en Houston
- **SEO crítico:** Optimizar meta tags, structured data, sitemap
- **Performance:** Mantener Lighthouse 90+
- **Público objetivo:** Pequeños negocios buscando presencia web
- **Sistema de pagos:** 50% inicial, 50% al completar
- **Rate limiting:** Implementado con Upstash para forms y APIs
- **Email quota:** Control diario para evitar límites de Resend

---

*Última actualización: Enero 2025*
