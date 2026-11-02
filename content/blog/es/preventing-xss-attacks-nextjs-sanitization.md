---
title: "Cómo prevenir ataques XSS en Next.js: guía práctica de sanitización de entradas"
description: "Cómo implementamos la sanitización de entradas en nuestra aplicación Next.js para prevenir ataques XSS, con ejemplos y código que puedes usar en tus proyectos."
tags: ["Seguridad", "XSS", "Next.js", "Desarrollo web", "Sanitización", "Buenas prácticas"]
---

# Cómo prevenir ataques XSS en Next.js: guía práctica de sanitización de entradas

La seguridad no es opcional. Al construir aplicaciones web, proteger a tus usuarios de los ataques de Cross-Site Scripting (XSS) debería ser una prioridad desde el primer día. En este artículo te cuento cómo implementamos la sanitización de entradas en nuestra aplicación Next.js.

---

## ¿Qué es XSS?

El Cross-Site Scripting (XSS) ocurre cuando un atacante inyecta scripts maliciosos en contenido que otros usuarios ven. Por ejemplo, imagina que alguien envía esto como su «nombre» en un formulario de contacto:

```html
<script>alert('Hacked!')</script>
```

Si tu aplicación lo renderiza directamente en un email o en una página web sin sanitizarlo, el script podría ejecutarse y robar datos de los usuarios o cookies de sesión, o realizar acciones en nombre del usuario.

---

## La solución: escapar el HTML

La solución es sencilla: convertir los caracteres peligrosos en entidades HTML seguras antes de renderizar. Esta es nuestra implementación:

```typescript
// src/lib/sanitize.ts

const htmlEscapes: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;",
};

export function escapeHtml(text: string | null | undefined): string {
  if (!text) return "";
  return text.replace(/[&<>"'`=/]/g, (char) => htmlEscapes[char] || char);
}
```

Ahora la entrada maliciosa se vuelve inofensiva:

| Entrada | Salida |
|-------|--------|
| `<script>alert('hack')</script>` | `&lt;script&gt;alert(&#x27;hack&#x27;)&lt;/script&gt;` |

El navegador muestra el texto literalmente en lugar de ejecutarlo como código.

---

## Sanitizadores especializados

Cada tipo de dato necesita un tratamiento distinto:

### Sanitización de emails

```typescript
export function sanitizeEmail(email: string | null | undefined): string {
  if (!email) return "";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return escapeHtml(email);
  }
  return escapeHtml(email);
}
```

### Sanitización de números de teléfono

```typescript
export function sanitizePhone(phone: string | null | undefined): string {
  if (!phone) return "";
  // Eliminar todo excepto dígitos, espacios y caracteres propios de un teléfono
  const sanitized = phone.replace(/[^\d\s+()-]/g, "");
  return escapeHtml(sanitized);
}
```

---

## Dónde aplicar la sanitización

**Sanitiza siempre que la entrada del usuario se vaya a renderizar como HTML:**

- Plantillas de email
- Páginas web que muestran contenido generado por los usuarios
- Generación de PDF
- Cualquier respuesta HTML

**Puede que no necesites sanitizar cuando:**

- Los datos se guardan en una base de datos (usa consultas parametrizadas en su lugar)
- Los datos se envían a APIs externas (ellas se encargan de su propia seguridad)
- Los datos provienen de fuentes internas de confianza

### Nuestra implementación

Aplicamos la sanitización en dos puntos clave:

1. **API del formulario de contacto** (`/api/receive-mail/route.ts`)
2. **Acción del formulario de contacto** (`createContactAction.ts`)

Ambos renderizan la entrada del usuario en emails HTML que se envían a nuestro administrador.

```typescript
// En nuestra acción de contacto
const safeName = escapeHtml(name);
const safeEmail = sanitizeEmail(email);
const safePhone = sanitizePhone(phone);
const safeMessage = escapeHtml(message);

// Usar los valores sanitizados en la plantilla del correo
await resend.emails.send({
  subject: `Nuevo mensaje de ${safeName}`,
  html: `<p>Mensaje: ${safeMessage}</p>`
});
```

---

## Errores comunes que debes evitar

### 1. Sanitizar demasiado tarde

```typescript
// Incorrecto: sanitizar después de guardar
const user = await prisma.user.create({ data: { name: userInput } });
const safeName = escapeHtml(user.name); // Demasiado tarde si ya se renderizó en otro lugar
```

### 2. Olvidar los casos límite

```typescript
// Incorrecto: no manejar null/undefined
function escapeHtml(text: string): string {
  return text.replace(/</g, "&lt;"); // Falla si text es null
}

// Correcto: manejar los casos límite
function escapeHtml(text: string | null | undefined): string {
  if (!text) return "";
  // ...
}
```

### 3. Sanitizar de más

No sanitices datos que no lo necesitan. Si guardas una dirección de email en una base de datos con consultas parametrizadas, no necesitas escapar los caracteres HTML: el driver de la base de datos se encarga de prevenir la inyección SQL.

---

## Prueba tu sanitización

Prueba estas entradas en tus formularios:

```
<script>alert('XSS')</script>
"><img src=x onerror=alert('XSS')>
javascript:alert('XSS')
<iframe src="javascript:alert('XSS')">
```

Si alguna se ejecuta en lugar de mostrarse como texto, tienes una vulnerabilidad.

---

## Conclusión

La sanitización de entradas es una de las medidas de seguridad más simples y, a la vez, más importantes que puedes implementar. Los principios clave:

1. **Nunca confíes en la entrada del usuario**
2. **Sanitiza antes de renderizar, no antes de guardar**
3. **Usa la sanitización adecuada para cada tipo de dato**
4. **Prueba con entradas maliciosas**

La seguridad es un proceso continuo, no una tarea puntual. Empieza con estos fundamentos y construye a partir de ahí.

---

*¿Necesitas ayuda para asegurar tu aplicación web? [Contáctanos](/es#contact) para una revisión de seguridad.*
