/**
 * Content Security Policy.
 *
 * Built per request in `src/proxy.ts` with a fresh nonce: `script-src` trusts
 * only the scripts that carry it (Next.js puts it on its own bundles and on
 * every `next/script`) and, through `'strict-dynamic'`, whatever those scripts
 * load themselves (gtag, the Meta/LinkedIn pixels, reCAPTCHA, Calendly). No
 * `'unsafe-inline'`: an injected `<script>` cannot guess the nonce, so it
 * never runs. `'unsafe-eval'` only in development (React rebuilds server
 * stack traces with eval there).
 *
 * Each third-party domain is grouped by service so it is easy to audit what
 * each one needs. The host list under `script-src` is the fallback for
 * browsers without `'strict-dynamic'`; modern browsers ignore it. Adding a
 * tracker means allowing the endpoints it sends data to (`connect-src`,
 * `img-src`, `frame-src`), not just its script.
 *
 * JSON-LD blocks (`type="application/ld+json"`) are data, not scripts: CSP
 * does not apply to them, so they need no nonce.
 *
 * `style-src` keeps `'unsafe-inline'` on purpose: React and Framer Motion
 * render `style=""` attributes, and `experimental.inlineCss` ships Tailwind
 * in a `<style>` tag. CSS injection is a far smaller risk than script
 * injection and a nonce there would silently break the layout.
 */

type CspDirectives = Record<string, string[]>;

function buildDirectives(nonce: string, isDev: boolean): CspDirectives {
  return {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      ...(isDev ? ["'unsafe-eval'"] : []),
      // Google Analytics 4 y Google Tag
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      // Google Ads
      "https://www.googleadservices.com",
      "https://googleads.g.doubleclick.net",
      // reCAPTCHA
      "https://www.google.com",
      "https://www.gstatic.com",
      // Facebook Pixel
      "https://connect.facebook.net",
      // LinkedIn Insight Tag
      "https://snap.licdn.com",
      // Calendly
      "https://assets.calendly.com",
    ],
    "style-src": [
      "'self'",
      "'unsafe-inline'",
      "https://fonts.googleapis.com",
      "https://assets.calendly.com",
    ],
    "font-src": ["'self'", "https://fonts.gstatic.com"],
    "img-src": ["'self'", "data:", "blob:", "https:", "http:"],
    // /tools/tiktok previsualiza el vídeo elegido con una URL blob: (URL.createObjectURL)
    "media-src": ["'self'", "blob:"],
    "connect-src": [
      "'self'",
      // Google Analytics 4: GA4 envía hits a subdominios regionales
      "https://www.google-analytics.com",
      "https://*.google-analytics.com",
      "https://analytics.google.com",
      "https://*.analytics.google.com",
      "https://stats.g.doubleclick.net",
      "https://www.googletagmanager.com",
      // Google Ads (conversiones y remarketing)
      "https://www.google.com",
      "https://google.com",
      "https://ad.doubleclick.net",
      "https://googleads.g.doubleclick.net",
      "https://www.googleadservices.com",
      "https://pagead2.googlesyndication.com",
      // Facebook Pixel
      "https://connect.facebook.net",
      "https://www.facebook.com",
      // LinkedIn Insight Tag
      "https://px.ads.linkedin.com",
      "https://px4.ads.linkedin.com",
      // Stripe, Vercel y Calendly
      "https://api.stripe.com",
      "https://vitals.vercel-insights.com",
      "https://*.vercel-analytics.com",
      "https://calendly.com",
      // TikTok Content Posting API: /tools/tiktok sube el video por trozos
      // directamente al upload_url (open-upload.tiktokapis.com, o .us para
      // cuentas de EE. UU.)
      "https://*.tiktokapis.com",
      "https://*.tiktokapis.us",
    ],
    "frame-src": [
      "'self'",
      "https://js.stripe.com",
      "https://www.google.com",
      "https://recaptcha.google.com",
      "https://calendly.com",
      // Google Ads usa iframes para conversiones
      "https://td.doubleclick.net",
      "https://bid.g.doubleclick.net",
      "https://www.googletagmanager.com",
      // Facebook Pixel abre un iframe para algunos eventos
      "https://www.facebook.com",
    ],
    // Nadie embebe el sitio en un iframe (equivalente moderno de X-Frame-Options)
    "frame-ancestors": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    // Facebook Pixel envía eventos grandes como formulario POST a facebook.com/tr
    "form-action": ["'self'", "https://checkout.stripe.com", "https://www.facebook.com"],
  };
}

/** Random, unguessable, base64 (the format browsers expect in `'nonce-…'`). */
export function createCspNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString("base64");
}

/** The header value for one request. */
export function buildContentSecurityPolicy(nonce: string, isDev: boolean): string {
  return Object.entries(buildDirectives(nonce, isDev))
    .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
    .join("; ");
}
