---
title: "Construyendo un sistema de gestión para salones de belleza con Next.js 15 y React 19"
description: "Caso de estudio: plataforma full-stack para un salón de belleza con reservas en línea, pagos con Stripe, panel de administración y tienda, con Next.js 15 y React 19."
tags: ["Next.js", "React 19", "TypeScript", "Desarrollo Full Stack", "Caso de estudio", "SaaS", "Stripe"]
---

# Construyendo un sistema de gestión para salones de belleza con Next.js 15 y React 19

Actualmente estoy desarrollando RC Beauty Salon, una aplicación web full-stack diseñada para digitalizar las operaciones de un salón de belleza profesional. El sistema integra reservas en línea, gestión de inventario, procesamiento de pagos y comunicación automatizada con los clientes. El proyecto está completado en aproximadamente un 80%, con la funcionalidad principal ya en pleno funcionamiento.

---

## Resumen del proyecto

En la industria de la belleza, gestionar a mano las citas, los horarios del personal, el inventario y la relación con los clientes termina en reservas perdidas, citas duplicadas e ingresos que se escapan. Nuestra solución ofrece una plataforma digital integral que automatiza estos procesos y, al mismo tiempo, brinda una experiencia excepcional al cliente.

**Principales retos de negocio resueltos:**
- **Reservas en línea** - Los clientes pueden reservar 24/7 sin llamar
- **Procesamiento de pagos** - Los depósitos seguros reducen las ausencias
- **Gestión del personal** - Cada profesional administra su propia agenda
- **Control de inventario** - Seguimiento de productos y ventas en línea
- **Fidelización de clientes** - Reseñas, correos automáticos y gestión de cuentas

---

## Stack tecnológico

| Categoría | Tecnología |
|-----------|------------|
| Framework | Next.js 15 (App Router + Turbopack) |
| Librería de UI | React 19 |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS v4 |
| Componentes | shadcn/ui + Radix UI |
| Iconos | Phosphor Icons |
| Base de datos | PostgreSQL |
| ORM | Prisma |
| Autenticación | NextAuth.js v5 (Beta) |
| Pagos | Stripe |
| Correos | Resend + React Email |
| Gestión de estado | Zustand |
| Validación | Zod + React Hook Form |
| Alojamiento de imágenes | Cloudinary |
| Manejo de fechas | date-fns |
| Notificaciones | Sonner |
| Temas | next-themes |

---

## Arquitectura de la aplicación

### Estructura de Route Groups

Aprovechamos los Route Groups de Next.js 15 para organizar la aplicación según los roles de usuario:

```
src/app/
├── (public)/          # Public pages (landing, services, staff)
├── (auth)/            # Login, register, password reset
├── (customer)/        # Customer portal (appointments, orders, account)
├── (staff)/           # Staff portal
├── (admin)/           # Admin dashboard
└── api/               # API routes and webhooks
```

Esta estructura ofrece una separación clara de responsabilidades y facilita aplicar layouts y middleware a roles de usuario concretos.

### Server Actions

Implementamos 103 Server Actions para manejar toda la lógica del lado del servidor, lo que elimina la necesidad de rutas de API tradicionales para las operaciones CRUD:

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

**Ventajas de las Server Actions:**
- Tipado seguro de extremo a extremo
- Sin el código repetitivo de las rutas de API
- Manejo automático de las peticiones
- Revalidación integrada

---

## Funcionalidades principales

### 1. Sistema de reservas

El flujo de reserva sigue un proceso de 4 pasos:

1. **Selección del servicio** - Categorías y servicios con precios
2. **Selección del profesional** - Personal disponible para el servicio elegido
3. **Fecha y hora** - Horarios disponibles según la jornada laboral
4. **Confirmación y pago** - Depósito de $50 a través de Stripe

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

### 2. Integración con Stripe

Implementamos webhooks para manejar los eventos de pago, tanto de los depósitos de citas como de las compras de productos:

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

**Funciones de pago:**
- Checkout seguro con Stripe Elements
- Manejo de webhooks para confirmar los pagos
- Actualización automática del estado de la cita
- Recibos y confirmaciones por correo

### 3. Sistema de correos transaccionales

Uso React Email para crear plantillas tipadas y reutilizables, con 10 tipos de correo distintos:

- Confirmación de cita
- Recordatorio de cita (24 h antes)
- Cita cancelada
- Cita reprogramada
- Cita completada
- Aviso de ausencia (no-show)
- Verificación de correo
- Restablecimiento de contraseña
- Cuenta activada
- Confirmación de pedido

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

### 4. Control de acceso por roles

Tres roles de usuario con permisos específicos:

| Rol | Permisos |
|-----|----------|
| ADMIN | Acceso total al sistema, panel, configuración, reportes |
| STAFF | Citas propias, agenda, perfil, disponibilidad |
| CUSTOMER | Reservas, pedidos, reseñas, gestión de la cuenta |

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

### 5. Tienda en línea

Experiencia de compra completa con:

- Catálogo de productos por categorías
- Carrito de compras persistente con Zustand
- Checkout seguro con Stripe
- Historial y seguimiento de pedidos
- Gestión de inventario

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

### 6. Funciones de React 19

Aprovechamos `useTransition` para actualizar la interfaz sin bloqueos durante las mutaciones en el servidor:

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

**Ventajas:**
- La interfaz sigue respondiendo durante las actualizaciones
- Estados de carga integrados
- No hace falta una librería externa de estado para las operaciones asíncronas

---

## Modelo de datos

El esquema de Prisma incluye 20 modelos interconectados:

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

**Lista completa de modelos:**
- User, Account, Session (autenticación)
- Customer, Staff, WorkingHours
- Service, ServiceCategory, StaffService
- Appointment, AppointmentService
- Product, ProductCategory, Order, OrderItem
- Review, Cart, CartItem
- SalonConfig, VerificationToken

---

## Optimizaciones implementadas

### Rendimiento

- **Server Components por defecto** - Menos JavaScript en el cliente
- **Turbopack** - Compilaciones de desarrollo 10 veces más rápidas
- **Optimización de imágenes** - next/image con Cloudinary
- **Índices en la base de datos** - Consultas optimizadas sobre claves foráneas

### Experiencia de usuario

- **useTransition** - Mutaciones sin bloquear la interfaz
- **Skeleton loaders** - Estructura del contenido mientras carga
- **Validación en tiempo real** - React Hook Form + Zod
- **Notificaciones toast** - Sonner para dar retroalimentación
- **Modo oscuro** - next-themes con la preferencia del sistema

### SEO

- **Metadata API** - Metaetiquetas dinámicas por página
- **URLs semánticas** - /services/haircut, /staff/maria
- **Datos estructurados** - JSON-LD para los servicios y el negocio

---

## Métricas del proyecto

| Métrica | Valor |
|---------|-------|
| Líneas de código | ~31,000 |
| Componentes de React | 171 |
| Server Actions | 103 |
| Modelos de Prisma | 20 |
| Plantillas de correo | 10 |
| Estado del proyecto | 80% completado |

---

## Lo que falta (20%)

El trabajo pendiente incluye:

### Crítico
- **Notificaciones por SMS** - Integración con Twilio para los recordatorios de cita
- **Cobro del saldo restante** - Cobrar el resto del monto antes de la cita
- **Cron jobs** - Programación automática de los recordatorios

### Importante
- **Días no disponibles del personal** - Gestión de vacaciones y días libres
- **Analítica avanzada** - Reportes de ingresos e información útil para decidir
- **Alertas de stock bajo** - Notificaciones de inventario

---

## Funciones del panel de administración

El panel de administración ofrece:

- **Tarjetas de resumen** - Citas de hoy, ingresos, clientes nuevos
- **Calendario de citas** - Gestión visual de la agenda
- **Gestión del personal** - Alta y edición del personal, horarios de trabajo
- **Gestión de servicios** - Categorías, precios, duraciones
- **Inventario de productos** - Niveles de stock, categorías, precios
- **Base de datos de clientes** - Datos de contacto, historial de citas
- **Gestión de pedidos** - Procesamiento de los pedidos de la tienda
- **Moderación de reseñas** - Aprobar o rechazar las reseñas de los clientes
- **Configuración** - Ajustes del salón, horario comercial

---

## Funciones del portal del personal

Cada miembro del personal tiene acceso a:

- **Agenda personal** - Ver las próximas citas
- **Configuración de disponibilidad** - Definir el horario de trabajo
- **Notas de clientes** - Añadir notas a las citas
- **Estadísticas de desempeño** - Citas completadas, ingresos generados
- **Gestión del perfil** - Biografía, foto, especialidades

---

## Funciones del portal del cliente

Los clientes pueden:

- **Reservar citas** - Flujo de reserva completo con pago
- **Gestionar citas** - Ver, reprogramar, cancelar
- **Comprar productos** - Explorar, carrito, checkout
- **Ver pedidos** - Historial y estado de los pedidos
- **Dejar reseñas** - Calificar servicios y personal
- **Gestionar la cuenta** - Perfil, contraseña, preferencias

---

## Lecciones clave

### 1. Las Server Actions simplifican el desarrollo full-stack

Se acabaron las rutas de API para el CRUD básico. Las Server Actions con validación de Zod ofrecen mutaciones seguras y tipadas con muy poco código repetitivo.

### 2. La arquitectura por roles escala

Usar Route Groups para separar las áreas de administración, personal y clientes hace que el código sea mantenible y seguro.

### 3. Zustand + Persist para el estado del cliente

El estado complejo del cliente, como el carrito de compras, se beneficia de la sencillez de Zustand y de su persistencia integrada en localStorage.

### 4. React Email para correos transaccionales bien diseñados

Construir correos con componentes de React es más rápido y más fácil de mantener que con los motores de plantillas tradicionales.

### 5. Los webhooks de Stripe son imprescindibles

Nunca confíes en la confirmación del pago desde el cliente. Los webhooks garantizan que el estado del pago sea siempre correcto.

---

## ¿Quieres construir algo parecido?

Esta arquitectura es perfecta para:
- Salones de belleza y spas
- Barberías
- Clínicas médicas y dentales
- Estudios de fitness y gimnasios
- Cualquier negocio que funcione con citas

Si necesitas un sistema de reservas y gestión a medida, ¡[hablemos](/es#contact)! Puedo ayudarte a:
- Diseñar un sistema adaptado a tu negocio
- Integrarlo con las herramientas que ya usas
- Construir una plataforma moderna y responsive
- Desplegarlo a producción
- Capacitar a tu equipo

---

## Conclusión

Construir este sistema de gestión para salones de belleza demuestra cómo Next.js 15 con el App Router y React 19 permiten crear aplicaciones empresariales complejas con una arquitectura limpia y mantenible. La combinación de Server Components, Server Actions y TypeScript ofrece una experiencia de desarrollo excepcional, a la vez que entrega una aplicación rápida y segura a los usuarios finales.

Llegar al 80% demuestra que una plataforma SaaS completa se puede construir de forma eficiente con herramientas modernas. El 20% restante se centra en la automatización (SMS, cron jobs) y en funciones avanzadas (analítica, cobro del saldo) que dejarán el sistema listo para producción.

---

**¿Te interesa una solución similar para tu negocio?**

Escríbenos a [contactus@rcweb.dev](mailto:contactus@rcweb.dev) para hablar de tu proyecto.

---

*RC Web Solutions LLC - Transformamos ideas en soluciones digitales*
