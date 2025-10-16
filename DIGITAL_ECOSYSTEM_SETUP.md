# Digital Ecosystem Setup Guide - RC Web Solutions

## ✅ Completado (Ya está en el código)

### 1. Google Analytics 4 (GA4) ✅
- **Estado**: Configurado en `layout.tsx`
- **Variable**: `NEXT_PUBLIC_GA_MEASUREMENT_ID` en `.env`
- **Uso**: Automático en todas las páginas

### 2. Google Tag Manager (GTM) ✅
- **Estado**: Configurado en `layout.tsx`
- **Variable**: `NEXT_PUBLIC_GTM_ID` en `.env`
- **Uso**: Automático en todas las páginas

### 3. Schema Markup (JSON-LD) ✅
- **Organization Schema**: ✅ Implementado
- **LocalBusiness Schema**: ✅ Implementado
- **FAQ Schema**: ✅ Implementado
- **Product Schema**: ✅ Implementado
- **Ubicación**: Componentes en `/src/app/components/JsonLd*.tsx`

### 4. Facebook Pixel ✅
- **Estado**: Código implementado
- **Variable requerida**: `NEXT_PUBLIC_FACEBOOK_PIXEL_ID`
- **Archivos**:
  - `src/app/components/FacebookPixel.tsx`
  - Script en `layout.tsx:123-150`

### 5. LinkedIn Insight Tag ✅
- **Estado**: Código implementado
- **Variable requerida**: `NEXT_PUBLIC_LINKEDIN_PARTNER_ID`
- **Archivos**:
  - `src/app/components/LinkedInInsightTag.tsx`
  - Script en `layout.tsx:152-170`

---

## 🔧 Configuración Requerida

### A. Facebook Pixel - Obtener tu Pixel ID

**Paso 1: Crear Facebook Pixel**
1. Ve a [Facebook Events Manager](https://business.facebook.com/events_manager2)
2. Haz clic en **"Connect Data Sources"** → **"Web"**
3. Selecciona **"Facebook Pixel"** → **"Connect"**
4. Asigna un nombre: "RC Web Solutions Pixel"
5. Opcional: Ingresa tu URL: `https://rcweb.dev`
6. Haz clic en **"Continue"**

**Paso 2: Obtener tu Pixel ID**
1. En Events Manager, verás tu Pixel
2. El **Pixel ID** es un número de 15-16 dígitos (ejemplo: `1234567890123456`)
3. Copia este ID

**Paso 3: Agregar al .env**
```bash
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=TU_PIXEL_ID_AQUI
```

**Paso 4: Verificar que funciona**
1. Instala [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) (Chrome Extension)
2. Visita tu sitio web
3. El icono de la extensión debería mostrar que el pixel está activo
4. En Facebook Events Manager → **"Test Events"** verás eventos en tiempo real

---

### B. LinkedIn Insight Tag - Obtener tu Partner ID

**Paso 1: Crear LinkedIn Insight Tag**
1. Ve a [LinkedIn Campaign Manager](https://www.linkedin.com/campaignmanager)
2. Selecciona tu cuenta (o crea una gratuita)
3. En el menú, ve a **"Account Assets"** → **"Insight Tag"**
4. Haz clic en **"Install"**

**Paso 2: Obtener tu Partner ID**
1. Verás el código del Insight Tag
2. Busca esta línea: `_linkedin_partner_id = "1234567";`
3. El número entre comillas es tu **Partner ID**
4. Copia este ID

**Paso 3: Agregar al .env**
```bash
NEXT_PUBLIC_LINKEDIN_PARTNER_ID=TU_PARTNER_ID_AQUI
```

**Paso 4: Verificar que funciona**
1. En LinkedIn Campaign Manager → **"Insight Tag"** → **"See Tag"**
2. Haz clic en **"Verify Installation"**
3. Ingresa tu URL: `https://rcweb.dev`
4. Deberías ver "Tag detected"

---

### C. Google Business Profile (Requiere acción manual)

**¿Qué es?**
Un perfil gratuito de Google que aparece en Google Maps y búsquedas locales. Esencial para SEO local.

**Paso 1: Crear tu perfil**
1. Ve a [Google Business Profile](https://business.google.com)
2. Haz clic en **"Manage now"**
3. Busca tu negocio: "RC Web Solutions LLC"
4. Si no existe, haz clic en **"Add your business to Google"**

**Paso 2: Información del negocio**
```
Nombre: RC Web Solutions LLC
Categoría: Web Developer
Ubicación: Houston, TX 77085
Área de servicio: Houston Metropolitan Area
Teléfono: +1 (346) 375-7534
Sitio web: https://rcweb.dev
Horario: Lunes-Viernes 8:00 AM - 5:00 PM
```

**Paso 3: Verificación**
- Google enviará una postal con código de verificación a tu dirección
- **Tiempo estimado**: 5-14 días
- Ingresa el código cuando llegue

**Paso 4: Optimizar tu perfil**
1. **Fotos**: Sube logo, foto de portada, fotos de trabajo
2. **Descripción**:
   ```
   Professional full-stack web development services specializing in Next.js, React,
   and custom web applications. Serving Houston and beyond with scalable digital
   solutions for businesses of all sizes.
   ```
3. **Servicios**: Lista tus servicios principales
4. **Posts**: Publica actualizaciones semanales
5. **Reseñas**: Solicita a clientes satisfechos que dejen reseñas

**Beneficios**:
- ✅ Aparece en Google Maps
- ✅ Mejora SEO local
- ✅ Muestra reseñas de clientes
- ✅ Gratis y esencial

---

### D. CRM Simple - Opciones Recomendadas

#### Opción 1: **Notion** (Más Simple) 🥇

**Ventajas:**
- ✅ Gratis ilimitado para uso personal
- ✅ Muy flexible
- ✅ Interfaz intuitiva
- ✅ Ya lo conoces (si lo usas)

**Desventajas:**
- ❌ Menos automatización
- ❌ No tiene integración nativa con formularios

**Setup rápido:**
1. Crea una database en Notion: "Clientes RC Web"
2. Columnas sugeridas:
   - Name (Título)
   - Email
   - Phone
   - Status (Select: Lead, Contacted, Quote Sent, Client, Closed)
   - Source (Select: Website, Referral, LinkedIn, etc.)
   - Services Interested
   - Budget Range
   - Notes (Text)
   - Created Date
   - Last Contact Date

3. Vistas:
   - Kanban por Status
   - Table view
   - Calendar por Last Contact

**Costo**: Gratis

---

#### Opción 2: **Airtable** (Balance) 🥈

**Ventajas:**
- ✅ Gratis hasta 1,200 records/base
- ✅ Vistas múltiples (Grid, Kanban, Calendar)
- ✅ Formularios integrados
- ✅ Integraciones con Zapier
- ✅ Más profesional que Notion para CRM

**Desventajas:**
- ❌ Límite de 1,200 records en plan gratuito
- ❌ Curva de aprendizaje media

**Setup rápido:**
1. Ve a [Airtable.com](https://airtable.com) y crea cuenta
2. Usa la plantilla: "CRM for Small Businesses"
3. Personaliza campos para tu negocio
4. Crea un formulario público para leads

**Integración con tu web** (Opcional):
```typescript
// En tu formulario de contacto, puedes enviar a Airtable API
const response = await fetch('https://api.airtable.com/v0/YOUR_BASE/Leads', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fields: {
      Name: name,
      Email: email,
      Phone: phone,
      Message: message
    }
  })
});
```

**Costo**: Gratis (plan Plus: $10/user/mes si necesitas más features)

---

#### Opción 3: **HubSpot CRM** (Más Completo) 🥉

**Ventajas:**
- ✅ Gratis hasta 1,000,000 contactos
- ✅ Email tracking
- ✅ Pipeline management
- ✅ Integración con formularios
- ✅ Automatizaciones básicas
- ✅ Muy profesional

**Desventajas:**
- ❌ Curva de aprendizaje alta
- ❌ Interface compleja
- ❌ Puede ser "overkill" para freelancer

**Setup:**
1. Ve a [HubSpot.com](https://www.hubspot.com/products/crm)
2. Crea cuenta gratuita
3. Sigue el wizard de configuración
4. Instala el tracking code en tu web (opcional)
5. Crea pipeline personalizado

**Costo**: Gratis (planes pagos desde $45/mes si necesitas más)

---

#### **Mi Recomendación:**

**Para empezar AHORA**: **Notion**
- Rápido de configurar (30 minutos)
- Sin curva de aprendizaje
- Perfecto para <50 leads/mes

**Para crecer (3-6 meses)**: **Airtable**
- Más profesional
- Mejor para seguimiento de pipeline
- Formularios integrados

**Para escalar (1+ año)**: **HubSpot CRM**
- Si tienes >100 leads/mes
- Necesitas automatización
- Quieres email marketing integrado

---

## 📊 Tracking de Conversiones Implementado

### Eventos disponibles en tu código:

**Facebook Pixel:**
```typescript
import { trackFBPurchase, trackFBLead, trackFBContact } from '@/app/components/FacebookPixel';

// En tu formulario de contacto:
trackFBLead(); // Cuando alguien envía el formulario

// En página de pago completado:
trackFBPurchase(1499, 'USD'); // Cuando hay una compra
```

**LinkedIn Insight:**
```typescript
import { trackLinkedInConversion } from '@/app/components/LinkedInInsightTag';

// En formulario de contacto:
trackLinkedInConversion();
```

---

## 🚀 Pasos Siguientes (Prioridad)

### Esta semana:
1. ✅ Agregar Facebook Pixel ID a `.env`
2. ✅ Agregar LinkedIn Partner ID a `.env`
3. ⏳ Crear Google Business Profile (toma 5-14 días verificar)
4. ⏳ Configurar CRM (Notion/Airtable) - 30 min

### Próximas 2 semanas:
5. Verificar Google Business Profile cuando llegue postal
6. Solicitar primeras 5 reseñas de clientes
7. Configurar pipeline en CRM elegido
8. Testear conversiones de Facebook/LinkedIn

### Mes 1-2:
9. Optimizar Google Business Profile con posts semanales
10. Crear automatizaciones en CRM (si usas Airtable/HubSpot)
11. Configurar reportes de conversión
12. Evaluar ROI de tracking pixels

---

## 🔍 Verificación Post-Despliegue

Después de desplegar con los IDs configurados:

**1. Facebook Pixel**
- Instalar [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
- Visitar tu sitio
- Verificar que el pixel aparece activo

**2. LinkedIn Insight Tag**
- Ir a Campaign Manager → Insight Tag → Verify Installation
- Ingresar tu URL
- Verificar detección

**3. Schema Markup**
- Ir a [Google Rich Results Test](https://search.google.com/test/rich-results)
- Ingresar: `https://rcweb.dev`
- Verificar que detecta Organization, LocalBusiness, FAQ, Product schemas

**4. Google Business Profile**
- Buscar en Google: "RC Web Solutions Houston"
- Tu perfil debería aparecer en el Knowledge Panel (después de verificar)

---

## 💰 Costos Totales

| Herramienta | Costo |
|-------------|-------|
| Google Analytics 4 | Gratis |
| Google Tag Manager | Gratis |
| Google Search Console | Gratis |
| Schema Markup | Gratis |
| Facebook Pixel | Gratis |
| LinkedIn Insight Tag | Gratis |
| Google Business Profile | Gratis |
| Notion CRM | Gratis |
| Airtable CRM | Gratis (hasta 1,200 records) |
| HubSpot CRM | Gratis (hasta 1M contacts) |
| **TOTAL** | **$0/mes** |

---

## 📞 Soporte

Si tienes problemas con alguna configuración:
- Facebook Pixel: [Facebook Business Help Center](https://www.facebook.com/business/help)
- LinkedIn Insight Tag: [LinkedIn Marketing Solutions Help](https://www.linkedin.com/help/lms)
- Google Business: [Google Business Profile Help](https://support.google.com/business)

---

**Última actualización**: 2025-10-15
**Creado por**: Claude Code Assistant
