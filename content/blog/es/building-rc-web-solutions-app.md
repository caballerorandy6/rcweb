---
title: "Cómo construí RC Web Solutions: de un portafolio simple a una aplicación de negocio completa"
description: "Las tecnologías, la arquitectura y la evolución de rcweb.dev: cómo un portafolio se convirtió en una aplicación web de negocio con pagos y campañas de email."
tags: ["Stack tecnológico", "Desarrollo web", "Caso de estudio", "Next.js"]
---

# Cómo construí RC Web Solutions: de portafolio a aplicación de negocio lista para producción

Cuando empecé con RC Web Solutions, como la mayoría de los desarrolladores, arranqué con un sitio web de portafolio sencillo. Unas cuantas páginas mostrando mi trabajo, un formulario de contacto y algo de información básica sobre mis servicios.

Pero a medida que el negocio creció, también lo hizo la necesidad de funciones más sofisticadas. Hoy, **rcweb.dev** no es solo un portafolio: es una **aplicación web de negocio completa** que se encarga de todo, desde la captación de clientes hasta el procesamiento de pagos, las campañas de email marketing y la analítica.

En este artículo te llevo detrás de cámaras para mostrarte exactamente cómo construí esta aplicación, qué tecnologías elegí y por qué.

---

## ¿Qué tipo de aplicación es RC Web Solutions?

Aclaremos primero qué tipo de aplicación es rcweb.dev:

### **Aplicación web de negocio** (no un SaaS)

RC Web Solutions es una **aplicación web de negocio (BWA, por sus siglas en inglés)** y no una plataforma SaaS tradicional. Esta es la diferencia:

**SaaS (software como servicio):**
- Múltiples inquilinos/usuarios con cuentas separadas
- Ingresos recurrentes por suscripción
- Paneles de usuario y acceso por roles
- Ejemplos: Shopify, Mailchimp, Salesforce

**Aplicación web de negocio:**
- Una sola entidad de negocio
- Funciones a medida para necesidades concretas
- Funciones de cara al cliente + herramientas internas
- Ejemplos: sitios corporativos con funciones avanzadas, sistemas de reservas, CRMs a medida

**RC Web Solutions es una BWA con funciones de tipo SaaS:**
- ✅ Backend avanzado
- ✅ Contenido gestionado desde base de datos
- ✅ Procesamiento de pagos
- ✅ Automatización de emails
- ✅ Sistema de campañas de newsletter
- ✅ Analítica y seguimiento
- ✅ Gestión del consentimiento de cookies
- ✅ Blog/CMS

Está diseñada para servir a **un solo negocio** (RC Web Solutions LLC) con **múltiples funciones complejas**, en lugar de servir a muchos negocios con funciones genéricas.

---

## La evolución: de portafolio a aplicación

### **Fase 1: portafolio simple** (v1.0)

Al principio, el sitio era muy básico:
- Páginas estáticas (Inicio, Sobre mí, Servicios, Contacto)
- HTML/CSS/JavaScript básico
- Formulario de contacto que enviaba emails
- Alojado en un hosting compartido

**Limitaciones:**
- ❌ Contenido difícil de actualizar
- ❌ Sin analítica
- ❌ Sin procesamiento de pagos
- ❌ Gestión manual de clientes
- ❌ Sin optimización SEO

### **Fase 2: reconstrucción con Next.js** (v2.0)

Reconstruí todo el sitio con tecnologías modernas:
- Migré a Next.js
- Añadí una base de datos PostgreSQL
- Implementé Prisma ORM
- Creé funciones de administración
- Añadí procesamiento de pagos

**Mejoras:**
- ✅ Renderizado en el servidor (mejor SEO)
- ✅ Páginas que cargan rápido
- ✅ Contenido gestionado desde base de datos
- ✅ Flujos de trabajo automatizados

### **Fase 3: aplicación de negocio completa** (v3.0, la actual)

La versión actual incluye:
- Sistema de campañas de newsletter con procesamiento por lotes
- Integración de pagos con Stripe
- Gestión del consentimiento de cookies (GDPR/CCPA)
- Blog con CMS en Markdown
- Analítica completa (GA4, Facebook Pixel)
- Integración de SMS marketing (Twilio)
- Gestión avanzada de contactos

**Resultado:** un ecosistema de negocio completo en una sola aplicación.

---

## Stack tecnológico: el desglose completo

Estas son todas las tecnologías detrás de rcweb.dev y por qué elegí cada una:

### **Frontend**

#### **Next.js 14 (App Router)**
```javascript
// Framework: Next.js 14
Why I chose it:
✅ Server-side rendering (SSR) = better SEO
✅ Static site generation (SSG) = lightning-fast pages
✅ API routes = backend and frontend in one project
✅ Image optimization = automatic WebP conversion
✅ File-based routing = intuitive structure
```

**Alternativa considerada:** React sin framework
**Por qué ganó Next.js:** SEO, rendimiento y optimizaciones de despliegue integradas

#### **TypeScript**
```typescript
// Type safety across the entire application
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  marketingConsent: boolean;
}
```

**Por qué TypeScript:**
- ✅ Detecta errores al compilar, no en producción
- ✅ Mejor autocompletado en el IDE
- ✅ Código autodocumentado
- ✅ Refactorizaciones más sencillas

#### **Tailwind CSS**
```jsx
<button className="px-6 py-3 bg-gold text-black rounded-lg hover:bg-gold/90">
  Contact Us
</button>
```

**Por qué Tailwind:**
- ✅ Utility-first = desarrollo más rápido
- ✅ Sin archivos CSS inflados
- ✅ Sistema de diseño consistente
- ✅ Diseño responsive sin complicaciones

**Alternativas consideradas:** Styled Components, CSS Modules
**Por qué ganó Tailwind:** velocidad de desarrollo y tamaño del bundle

#### **Framer Motion**
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content here
</motion.div>
```

**Por qué Framer Motion:**
- ✅ Animaciones fluidas y profesionales
- ✅ Excelente soporte de TypeScript
- ✅ Buen rendimiento
- ✅ Fácil de usar

---

### **Backend**

#### **Base de datos PostgreSQL**
```sql
-- Relational database for structured data
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  message TEXT,
  marketing_consent BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Por qué PostgreSQL:**
- ✅ Robusta y confiable
- ✅ Cumple ACID (integridad de datos)
- ✅ Excelente para datos relacionales
- ✅ Soporte de JSON (híbrido SQL/NoSQL)
- ✅ Gratuita y de código abierto

**Alternativas consideradas:** MongoDB, MySQL
**Por qué ganó PostgreSQL:** el mejor equilibrio entre funciones, confiabilidad y rendimiento

#### **Prisma ORM**
```typescript
// Type-safe database queries
const contacts = await prisma.contact.findMany({
  where: {
    marketingConsent: true,
  },
  orderBy: {
    createdAt: 'desc',
  },
});
```

**Por qué Prisma:**
- ✅ Tipos de TypeScript generados automáticamente
- ✅ Sintaxis de consultas intuitiva
- ✅ Migraciones de base de datos sencillas
- ✅ Excelente experiencia de desarrollo

#### **API Routes de Next.js (Server Actions)**
```typescript
// app/actions/createContactAction.ts
'use server';

export async function createContactAction(data: FormData) {
  const contact = await prisma.contact.create({
    data: {
      name: data.name,
      email: data.email,
      // ...
    },
  });

  return { success: true, contact };
}
```

**Por qué Server Actions:**
- ✅ No hacen falta endpoints de API separados
- ✅ Seguridad de tipos automática
- ✅ Mejora progresiva
- ✅ Manejo de errores simplificado

---

### **Integraciones de terceros**

#### **Stripe (pagos)**
```typescript
// Secure payment processing
const checkout = await stripe.checkout.sessions.create({
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: { name: 'Web Development Services' },
      unit_amount: 149900, // $1,499.00
    },
    quantity: 1,
  }],
  mode: 'payment',
  success_url: `${domain}/success`,
  cancel_url: `${domain}/canceled`,
});
```

**Por qué Stripe:**
- ✅ El estándar de la industria en pagos
- ✅ Excelente experiencia de desarrollo
- ✅ Protección contra fraude integrada
- ✅ Documentación muy completa

#### **Resend (servicio de email)**
```typescript
// Transactional emails + newsletter campaigns
await resend.emails.send({
  from: 'RC Web <no-reply@rcweb.dev>',
  to: ['customer@example.com'],
  subject: 'Thank you for contacting us!',
  html: emailTemplate,
});
```

**Por qué Resend:**
- ✅ API moderna (mejor que SendGrid/Mailgun)
- ✅ Soporte de React Email
- ✅ Muy buenas tasas de entregabilidad
- ✅ Plan gratuito (100 emails/día)

**Funciones construidas con Resend:**
- Confirmaciones del formulario de contacto
- Campañas de newsletter (procesamiento por lotes)
- Recibos de pago
- Emails de bienvenida

#### **Twilio (SMS marketing)**
```typescript
// SMS campaigns to contacts who opted in
await twilio.messages.create({
  body: 'New on the RC Web blog: how much a website costs in Houston in 2026.',
  from: '+1234567890',
  to: customer.phone,
});
```

**Por qué Twilio:**
- ✅ Entrega de SMS confiable
- ✅ Funciones de cumplimiento normativo (TCPA, alta y baja voluntarias)
- ✅ Gestión de campañas

#### **Google Analytics 4 + Facebook Pixel**
```typescript
// Track conversions and user behavior
gtag('event', 'conversion', {
  send_to: 'AW-XXXXXXX/XXXXXX',
  value: 1499.00,
  currency: 'USD',
});
```

**Por qué los dos:**
- ✅ GA4: información profunda sobre el comportamiento de los usuarios
- ✅ Facebook Pixel: retargeting y optimización de anuncios
- ✅ Seguimiento de conversiones en todas las plataformas

---

### **Desarrollo y despliegue**

#### **Vercel (hosting y despliegue)**
```bash
# Automatic deployments on every git push
git push origin main
# → Vercel automatically builds and deploys
```

**Por qué Vercel:**
- ✅ Creado por el equipo de Next.js (optimizado para Next.js)
- ✅ Red edge (rápido en todo el mundo)
- ✅ Despliegues de vista previa automáticos
- ✅ Configuración cero
- ✅ Plan gratuito apto para producción

#### **Neon (hosting de PostgreSQL)**
```javascript
// Serverless PostgreSQL database
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/rcweb"
```

**Por qué Neon:**
- ✅ Serverless (escala a cero)
- ✅ Plan gratuito generoso
- ✅ Ramas instantáneas (dev/staging/prod)
- ✅ Escalado automático

#### **Git y GitHub**
```bash
# Version control and collaboration
git commit -m "Add newsletter campaign system"
git push origin main
```

**Por qué Git/GitHub:**
- ✅ Historial completo de versiones
- ✅ Reversiones sencillas
- ✅ Listo para colaborar
- ✅ Integración con CI/CD

---

## Funciones clave y cómo están construidas

### **1. Sistema de campañas de newsletter**

**El problema:** el plan gratuito de Resend limita a 100 emails/día

**La solución:** construí un sistema propio de procesamiento por lotes

```typescript
// Send 100 emails/day automatically
async function sendBatchCampaign(campaignId: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
  });

  // Get next 100 contacts who haven't received the email
  const contacts = await prisma.contact.findMany({
    where: {
      marketingConsent: true,
      emails: {
        none: { campaignId },
      },
    },
    take: 100,
  });

  // Send emails
  for (const contact of contacts) {
    await resend.emails.send({
      from: 'RC Web <no-reply@rcweb.dev>',
      to: contact.email,
      subject: campaign.subject,
      html: campaign.content,
    });
  }

  // Update campaign status
  await prisma.campaign.update({
    where: { id: campaignId },
    data: {
      emailsSent: { increment: contacts.length },
      lastBatchSentAt: new Date(),
    },
  });
}
```

**Funciones:**
- ✅ Envío automático a más de 1000 contactos a lo largo de 10 días
- ✅ Seguimiento del progreso (emails enviados, restantes, % completado)
- ✅ Reanudación de campañas fallidas
- ✅ Vista previa de los emails antes de enviarlos
- ✅ Varias plantillas (newsletter, anuncios, etc.)

### **2. Procesamiento de pagos con Stripe**

```typescript
// Create checkout session
export async function createStripeCheckoutAction(
  packageId: string,
  amount: number,
  customerEmail: string
) {
  const session = await stripe.checkout.sessions.create({
    customer_email: customerEmail,
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${packageId} Package`,
          description: 'Professional web development services',
        },
        unit_amount: amount * 100, // Convert to cents
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${siteConfig.baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteConfig.baseUrl}/pricing`,
  });

  return { url: session.url };
}
```

**Funciones:**
- ✅ Pago seguro
- ✅ Múltiples métodos de pago
- ✅ Recibos automáticos
- ✅ Manejo de webhooks para confirmar el pago

### **3. Gestión de contactos con protección contra bots**

**Protección contra bots en varias capas:**

```typescript
// Layer 1: Honeypot field (invisible to humans, visible to bots)
<input
  type="text"
  name="website"
  style={{ position: 'absolute', left: '-9999px' }}
/>

// Layer 2: Minimum time check (humans take >3 seconds)
const timeSpent = Date.now() - formMountTime;
if (timeSpent < 3000) {
  return { error: 'Form submitted too quickly' };
}

// Layer 3: reCAPTCHA v3 (invisible verification)
const token = await grecaptcha.execute(SITE_KEY, { action: 'submit' });
const score = await verifyRecaptchaToken(token);
if (score < 0.5) {
  return { error: 'Verification failed' };
}
```

**Resultado:** 99.9% menos spam sin molestar a los usuarios

### **4. Consentimiento de cookies (conforme a GDPR/CCPA)**

```typescript
// Track essential vs. optional cookies
const [consent, setConsent] = useState({
  essential: true,    // Required (can't be disabled)
  analytics: false,   // Optional (GA4)
  marketing: false,   // Optional (Facebook Pixel, ads)
});

// Only load scripts if user consents
{consent.analytics && <GoogleAnalytics />}
{consent.marketing && <FacebookPixel />}
```

**Funciones:**
- ✅ Separación entre cookies esenciales y opcionales
- ✅ Consentimiento persistente (localStorage)
- ✅ Fácil de revocar
- ✅ Conforme a GDPR y CCPA

### **5. Sistema de blog con Markdown**

```typescript
// No database needed for blog posts!
// content/blog/my-post.md
---
title: "My Blog Post"
date: "2025-01-22"
---

# Content here in Markdown
```

**Por qué Markdown:**
- ✅ Fácil de escribir (sin necesidad de CMS)
- ✅ Control de versiones con Git
- ✅ Rápido (generación estática)
- ✅ Optimizado para SEO automáticamente
- ✅ Fácil de migrar

---

## Arquitectura y patrones de diseño

### **Arquitectura de componentes**

```
src/
├── app/                    # Next.js app router
│   ├── (routes)/          # Page routes
│   ├── api/               # API routes
│   ├── components/        # Shared components
│   └── actions/           # Server actions
├── lib/                   # Utility functions
├── hooks/                 # Custom React hooks
├── config/                # Configuration files
└── types/                 # TypeScript types
```

### **Patrones de diseño utilizados**

1. **Server Components (por defecto)**: se renderizan en el servidor para mejor rendimiento
2. **Client Components ("use client")**: solo cuando hace falta interactividad
3. **Server Actions**: mutaciones en el servidor con seguridad de tipos
4. **Actualizaciones optimistas**: respuesta instantánea en la interfaz
5. **Error Boundaries**: manejo elegante de errores
6. **Estados de carga**: mejor UX con esqueletos de carga

---

## Optimizaciones de rendimiento

### **1. Optimización de imágenes**
```jsx
// Automatic WebP conversion, lazy loading, responsive sizes
<Image
  src="/hero.jpg"
  width={1920}
  height={1080}
  alt="Hero"
  priority // Load immediately (above fold)
/>
```

### **2. División de código (code splitting)**
```typescript
// Dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false, // Don't render on server
});
```

### **3. Optimización de fuentes**
```typescript
// Preload critical fonts
import { Inter, Iceland } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevent invisible text
});
```

### **4. Estrategia de caché**
```typescript
// Static pages cached at CDN edge
export const revalidate = 3600; // Revalidate every hour

// Dynamic data cached in-memory
const cachedData = unstable_cache(
  async () => await fetchExpensiveData(),
  ['cache-key'],
  { revalidate: 60 }
);
```

**Resultados:**
- ✅ **Puntuación de Lighthouse:** 95-100 (rendimiento)
- ✅ **First Contentful Paint:** <1.5s
- ✅ **Time to Interactive:** <3s
- ✅ **Tamaño total del bundle:** <200KB (gzip)

---

## Medidas de seguridad

### **1. Validación de entradas**
```typescript
// Zod schema validation
const FormSchema = z.object({
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone'),
  message: z.string().min(10, 'Message too short').max(1000, 'Message too long'),
});
```

### **2. Prevención de inyección SQL**
```typescript
// Prisma uses parameterized queries automatically
// ✅ SAFE:
await prisma.contact.findMany({ where: { email } });

// ❌ NEVER DO THIS:
await prisma.$executeRaw(`SELECT * FROM contacts WHERE email = '${email}'`);
```

### **3. Limitación de peticiones (rate limiting)**
```typescript
// Prevent abuse of API endpoints
const rateLimit = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
});
```

### **4. Variables de entorno**
```bash
# Never commit secrets to Git
DATABASE_URL="postgresql://..."
STRIPE_SECRET_KEY="sk_live_..."
RESEND_API_KEY="re_..."
```

---

## Retos y soluciones

### **Reto 1: límites en las campañas de email**

**Problema:** el plan gratuito de Resend = 100 emails/día, pero tengo más de 500 contactos

**Solución:** construí un sistema de procesamiento por lotes
- Envía 100 al día automáticamente
- Guarda el progreso en la base de datos
- Se reanuda a las 24 horas
- Una campaña para 500 contactos se completa en 5 días

### **Reto 2: cumplimiento normativo en SMS marketing**

**Problema:** Twilio rechazó la campaña por problemas de cumplimiento

**Solución:**
- Actualicé la política de privacidad (eliminé la cláusula «sin consentimiento»)
- Añadí «la frecuencia de los mensajes puede variar» al texto de alta
- Cambié el caso de uso de «mixto» a «solo marketing»
- Redacté documentación de cumplimiento detallada

### **Reto 3: errores de TypeScript con rutas dinámicas**

**Problema:** `Type '/blog/${string}' is not assignable to Route`

**Solución:** usar la aserción de tipo adecuada
```typescript
import type { Route } from 'next';
<Link href={`/blog/${slug}` as Route}>
```

### **Reto 4: spam en el formulario**

**Problema:** recibía más de 50 envíos de spam al día

**Solución:** protección en varias capas
- Campos honeypot
- Comprobación de tiempo mínimo
- reCAPTCHA v3
- Validación de email
- Resultado: 99.9% menos spam

---

## Métricas y resultados

### **Rendimiento**
- ✅ Tiempo de carga: <2 segundos
- ✅ Puntuación de Lighthouse: 95-100
- ✅ Puntuación SEO: 100
- ✅ Accesibilidad: 95+

### **Impacto en el negocio**
- ✅ 40% más de envíos del formulario de contacto
- ✅ 25% más de duración media de sesión
- ✅ 60% menos de tasa de rebote
- ✅ 3 veces más suscripciones al newsletter

### **Técnico**
- ✅ 0 errores críticos en producción
- ✅ 99.9% de disponibilidad
- ✅ Bundle de <200KB
- ✅ Cobertura total de TypeScript

---

## ¿Qué viene después?

Mejoro rcweb.dev constantemente. Esto es lo que hay en la hoja de ruta:

### **Primer trimestre de 2025**
- ✅ Sistema de blog (¡completado!)
- 🔄 Panel de analítica avanzado
- 🔄 Sistema de generación de facturas
- 🔄 Informes SEO automatizados para clientes

### **Segundo trimestre de 2025**
- Portal de gestión de proyectos
- Panel para clientes (ver el progreso del proyecto)
- Integración de chat en vivo
- Framework de pruebas A/B

### **Tercer trimestre de 2025**
- Aplicación móvil (React Native)
- API para integraciones de terceros
- Flujos de automatización avanzados

---

## Lecciones aprendidas

### **1. Empieza simple y escala poco a poco**

No construí todas estas funciones de golpe. Empecé con un sitio básico y fui añadiendo funciones conforme el negocio las necesitaba. Este enfoque:
- ✅ Me mantuvo enfocado en lo importante
- ✅ Evitó que me abrumara
- ✅ Me permitió iterar a partir de comentarios reales

### **2. TypeScript vale la pena**

Sí, al principio requiere más configuración. Pero me ha ahorrado incontables horas de depuración y ha evitado muchos errores en producción.

### **3. Elige tecnología «aburrida» (a veces)**

Usé PostgreSQL en lugar de «la nueva base de datos NoSQL de moda» porque:
- Está probada y es confiable
- Tiene muy buena documentación
- Tiene una gran comunidad
- Está curtida en producción

**Opinión polémica:** a veces lo aburrido es mejor.

### **4. Invierte en la experiencia de desarrollo**

Herramientas como Prisma, TypeScript y Tailwind CSS hacen que desarrollar sea **más rápido** y **más agradable**. La curva de aprendizaje inicial se paga sola.

### **5. El rendimiento importa**

Un sitio web rápido es un sitio web que convierte. Cada 100ms de mejora en el tiempo de carga aumenta la tasa de conversión.

---

## ¿Quieres construir algo parecido?

Este stack tecnológico es perfecto para:
- ✅ Sitios web de negocio con funciones avanzadas
- ✅ Aplicaciones SaaS
- ✅ Plataformas de comercio electrónico
- ✅ Sitios de portafolio con CMS
- ✅ Sistemas de reservas

Si te interesa construir una aplicación a medida como esta, [hablemos](/es#contact). Puedo ayudarte a:
- Elegir el stack tecnológico adecuado para tus necesidades
- Diseñar una arquitectura escalable
- Implementar funciones complejas
- Desplegar a producción
- Mantener y optimizar

---

## ¿Código abierto?

Estoy considerando liberar como código abierto algunas partes de este proyecto, en particular:
- El sistema de campañas de newsletter
- La protección contra bots en varias capas
- La gestión del consentimiento de cookies
- Las utilidades de procesamiento por lotes

**¿Te interesa?** Dímelo en los comentarios o [envíame un mensaje](/es#contact).

---

## Reflexiones finales

Construir rcweb.dev ha sido una experiencia de aprendizaje increíble. Lo que empezó como un simple portafolio ha evolucionado hasta convertirse en una aplicación de negocio completa que se encarga de todo, desde la captación de clientes hasta el procesamiento de pagos.

Las claves:
1. **Usa herramientas modernas**: hacen el desarrollo más rápido y confiable
2. **Optimiza el rendimiento**: tus usuarios (y Google) te lo agradecerán
3. **Itera según necesidades reales**: no sobredimensiones desde el primer día
4. **Mide todo**: las decisiones basadas en datos le ganan a las suposiciones
5. **Nunca dejes de aprender**: la tecnología evoluciona, y tus habilidades también deberían

---

## Resumen del stack tecnológico

**Frontend:**
- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion

**Backend:**
- PostgreSQL
- Prisma ORM
- Next.js Server Actions

**Integraciones:**
- Stripe (pagos)
- Resend (email)
- Twilio (SMS)
- Google Analytics 4
- Facebook Pixel

**Hosting:**
- Vercel (aplicación)
- Neon (base de datos)

**Herramientas:**
- Git/GitHub
- VS Code
- Postman
- Figma

---

**¿Tienes preguntas sobre el stack tecnológico o quieres hablar de tu propio proyecto? [Escríbeme](/es#contact), me encantará conversar.**

---

*Este artículo forma parte de nuestra serie sobre desarrollo web, tecnología y crecimiento de negocios. [Suscríbete a nuestro newsletter](/es#contact) para enterarte cuando publiquemos nuevos artículos.*

**RC Web Solutions LLC**
*Construyendo el futuro, una línea de código a la vez.*
