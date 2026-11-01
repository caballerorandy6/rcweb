---
title: "De 50 a 98: cómo optimicé rcweb.dev para una puntuación casi perfecta en PageSpeed"
description: "Recorrido detallado por las optimizaciones de rendimiento que llevaron a rcweb.dev de 50 a 98 en PageSpeed: LCP, carga diferida, estrategia de fuentes y más."
tags: ["Rendimiento", "Desarrollo web", "PageSpeed", "Next.js", "Optimización"]
---

# De 50 a 98: cómo optimicé rcweb.dev para una puntuación casi perfecta en PageSpeed

El rendimiento web no es solo una métrica técnica: es la diferencia entre un cliente que se queda y uno que se va. Los estudios muestran que **el 53% de los usuarios móviles abandona los sitios que tardan más de 3 segundos en cargar**.

Hace poco hice una optimización integral del rendimiento de rcweb.dev. ¿El resultado? Un salto de **50 a 98** en Google PageSpeed Insights, con puntuaciones perfectas en Accesibilidad, Buenas prácticas y SEO.

Aquí te cuento exactamente cómo lo hice.

---

## El punto de partida: puntuación de 50

Antes de la optimización, rcweb.dev tenía problemas de rendimiento importantes:

| Métrica | Antes | Estado |
|---------|-------|--------|
| **Rendimiento** | 50 | Deficiente |
| **LCP** | 9.9s | Crítico |
| **TBT** | 1,070ms | Deficiente |
| **FCP** | 3.2s | Necesita mejorar |
| **CLS** | 0.1 | Necesita mejorar |

Los principales culpables eran:
- Un video de fondo pesado en la sección hero
- JavaScript que bloqueaba el renderizado (reCAPTCHA cargándose de inmediato)
- Animaciones de Framer Motion que bloqueaban el LCP
- El banner de cookies apareciendo durante la medición del LCP
- Carga de fuentes sin optimizar

---

## El resultado final: puntuación de 98

Después de la optimización:

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| **Rendimiento** | 50 | 98 | +96% |
| **LCP** | 9.9s | 2.1s | -79% |
| **TBT** | 1,070ms | 70ms | -93% |
| **FCP** | 3.2s | 1.0s | -69% |
| **CLS** | 0.1 | 0 | Perfecto |
| **Accesibilidad** | 99 | 100 | Perfecto |
| **Buenas prácticas** | 100 | 100 | Perfecto |
| **SEO** | 100 | 100 | Perfecto |

---

## Optimización 1: sustituir el video por una imagen optimizada

La sección hero usaba originalmente un video de fondo en bucle. Aunque visualmente llama la atención, los videos son un asesino del rendimiento:

**Problema:**
```tsx
// Before: Video element competing with LCP
<video autoPlay loop muted playsInline preload="none">
  <source src="/hero.webm" type="video/webm" />
</video>
```

**Solución:**
```tsx
// After: Optimized image with priority loading
import Image from "next/image";
import heroImage from "../../../public/hero.webp";

<Image
  src={heroImage}
  alt=""
  fill
  priority
  sizes="100vw"
  className="object-cover opacity-35"
  aria-hidden="true"
/>
```

**Impacto:** el LCP bajó unos 3 segundos. El atributo `priority` le indica a Next.js que precargue esta imagen, y usar una importación estática permite optimizarla en tiempo de compilación.

---

## Optimización 2: carga diferida de reCAPTCHA

reCAPTCHA v3 carga un paquete de JavaScript considerable (~150KB). Cargarlo de inmediato bloquea el hilo principal.

**Problema:**
```tsx
// Before: reCAPTCHA loads on page load
<Script
  src={`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`}
  strategy="afterInteractive"
/>
```

**Solución:**
```tsx
// After: reCAPTCHA loads only when user interacts with form
const [loadRecaptcha, setLoadRecaptcha] = useState(false);

const handleFormInteraction = useCallback(() => {
  if (!loadRecaptcha) setLoadRecaptcha(true);
}, [loadRecaptcha]);

// Only render Script when needed
{loadRecaptcha && (
  <Script
    src={`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`}
    strategy="afterInteractive"
  />
)}

// Trigger on form focus
<form onFocus={handleFormInteraction}>
```

**Impacto:** el TBT bajó de 1,070ms a ~120ms. El script de reCAPTCHA solo se carga cuando el usuario interactúa de verdad con el formulario de contacto.

---

## Optimización 3: corregir el bloqueo del LCP por Framer Motion

Las animaciones de Framer Motion que empiezan con `opacity: 0` bloquean el LCP, porque el navegador espera a que termine la animación antes de considerar el elemento «visible».

**Problema:**
```tsx
// Before: h1 wrapped in motion.div with opacity: 0
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  <h1>RC Web Solutions</h1>
</motion.div>
```

**Solución:**
```tsx
// After: h1 outside motion.div, uses CSS animation
<h1 className="animate-hero-title">
  RC Web Solutions
</h1>

// CSS animation that doesn't affect LCP
@keyframes hero-title {
  from {
    transform: scale(0.96) translateY(12px);
  }
  to {
    transform: scale(1) translateY(0);
  }
}
```

**Idea clave:** las animaciones CSS que solo usan propiedades `transform` no bloquean el LCP, porque el elemento es visible desde el primer fotograma. Evita `opacity` y `filter` en las animaciones del elemento LCP.

**Impacto:** se eliminó el retraso de renderizado del elemento LCP (~2.5 segundos ahorrados).

---

## Optimización 4: retrasar el banner de cookies

Los banners de consentimiento de cookies que aparecen durante los primeros 2.5 segundos pueden convertirse en el elemento LCP y hundir la puntuación.

**Problema:**
```tsx
// Before: Banner appears after 1 second
setTimeout(() => setIsVisible(true), 1000);
```

**Solución:**
```tsx
// After: Banner appears after 5 seconds (past LCP window)
setTimeout(() => setIsVisible(true), 5000);
```

**Impacto:** el banner de cookies ya no compite con el contenido real en la medición del LCP.

---

## Optimización 5: estrategia de carga de fuentes

Las fuentes personalizadas pueden retrasar el renderizado del texto. La fuente Iceland que uso en los títulos necesitaba atención especial.

**Problema:** la carga de la fuente bloqueaba el renderizado inicial.

**Solución:**
```tsx
const iceland = Iceland({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-iceland",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: false,
});
```

**Ajustes clave:**
- `display: "swap"` - Muestra la fuente de respaldo de inmediato
- `preload: true` - Prioriza la carga de la fuente
- `fallback` - Especifica fuentes del sistema parecidas
- `adjustFontFallback: false` - Renderizado inicial más rápido

---

## Optimización 6: importaciones dinámicas para componentes no críticos

Los componentes que no hacen falta en el renderizado inicial deberían cargarse de forma diferida.

**Solución:**
```tsx
import dynamic from "next/dynamic";

const DialogForm = dynamic(() => import("./DialogForm"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});
```

**Impacto:** reduce el paquete inicial de JavaScript y mejora el TBT y el FCP.

---

## Optimización 7: apuntar a navegadores modernos

Los polyfills de JavaScript heredado añaden bytes innecesarios para los navegadores modernos.

**Solución en package.json:**
```json
"browserslist": [
  "last 2 Chrome versions",
  "last 2 Firefox versions",
  "last 2 Safari versions",
  "last 2 Edge versions"
]
```

**Impacto:** elimina los polyfills de funciones como `Array.prototype.at`, `Object.fromEntries`, etc. (~12KB ahorrados).

---

## Optimización 8: carga diferida de Google Analytics

Los scripts de analítica no necesitan cargarse de inmediato.

**Antes:**
```tsx
<Script
  src="https://www.googletagmanager.com/gtag/js"
  strategy="afterInteractive"
/>
```

**Después:**
```tsx
<Script
  src="https://www.googletagmanager.com/gtag/js"
  strategy="lazyOnload"
/>
```

**Impacto:** la analítica se carga después de todo lo demás, sin competir con los recursos críticos.

---

## Lo que no funcionó: lecciones aprendidas

### 1. Animaciones con filtros CSS

Usar `filter: blur()` en las animaciones disparó el TBT de 70ms a 240ms:

```css
/* Don't do this on LCP elements */
@keyframes hero-title {
  from {
    filter: blur(3px); /* Expensive! */
  }
}
```

**Lección:** las propiedades `filter` consumen mucha CPU. Quédate con `transform` para las animaciones.

### 2. Opacidad en el estado inicial

Cualquier animación que empiece con `opacity: 0` bloqueará el LCP:

```tsx
// This blocks LCP
initial={{ opacity: 0 }}
```

**Lección:** los elementos LCP deben ser visibles de inmediato. Usa animaciones solo con `transform`.

---

## Herramientas utilizadas

- **Google PageSpeed Insights** - Herramienta principal de pruebas
- **Panel Performance de Chrome DevTools** - Análisis detallado
- **Next.js Bundle Analyzer** - Optimización del paquete de JavaScript
- **WebPageTest** - Pruebas desde varias ubicaciones

---

## La lista de verificación de rendimiento

Usa esta lista para tus propias optimizaciones:

### Crítico (LCP)
- [ ] Las imágenes del hero usan los atributos `priority` y `sizes`
- [ ] Sin videos en el contenido visible sin hacer scroll
- [ ] El elemento LCP no tiene animaciones de opacidad
- [ ] Las fuentes usan `display: swap` y `preload`

### Importante (TBT)
- [ ] Scripts de terceros con carga diferida
- [ ] reCAPTCHA se carga solo al interactuar
- [ ] Sin animaciones con `filter` en elementos visibles
- [ ] Importaciones dinámicas para componentes no críticos

### Deseable
- [ ] Configuración moderna de browserslist
- [ ] Banner de cookies retrasado más allá de los 2.5s
- [ ] La analítica usa la estrategia `lazyOnload`

---

## Conclusión

La optimización del rendimiento es un proceso iterativo. Cada cambio hay que probarlo y, a veces, optimizaciones que parecen buenas (como las animaciones con desenfoque) en realidad perjudican el rendimiento.

Las lecciones clave:

1. **Mide primero** - Usa PageSpeed Insights para detectar los problemas reales
2. **Céntrate en el LCP** - Suele ser la mayor oportunidad de mejora
3. **Carga de forma diferida todo lo que no sea crítico** - Scripts, imágenes, componentes
4. **Prueba después de cada cambio** - Las puntuaciones varían; haz varias pruebas
5. **No optimices de más** - 98 es excelente; perseguir el 100 puede exigir sacrificar la experiencia de usuario

**Cada segundo cuenta.** Un sitio web más rápido significa más conversiones, mejor posicionamiento en buscadores y usuarios más contentos.

---

*¿Necesitas ayuda para optimizar el rendimiento de tu sitio web? [Escríbeme](/es#contact) y te hago una auditoría de rendimiento gratuita.*
