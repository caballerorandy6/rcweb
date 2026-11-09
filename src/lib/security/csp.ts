/**
 * Content Security Policy.
 *
 * Static, sent from next.config.ts with the other security headers, so pages
 * can be prerendered and served from the CDN. A per-request nonce forced
 * every page to render on each visit (2026-10-30 to 2026-11-09) and nearly
 * used up the Vercel Hobby CPU quota. `script-src` therefore allows
 * `'unsafe-inline'` (Next.js inlines its flight data and the consent-mode
 * snippet) plus an explicit list of hosts: a script from any other origin
 * never runs. `'unsafe-eval'` only in development (React rebuilds server
 * stack traces with eval there).
 *
 * Each third-party domain is grouped by service so it is easy to audit what
 * each one needs. Adding a tracker means allowing its script host here and
 * the endpoints it sends data to (`connect-src`, `img-src`, `frame-src`).
 *
 * JSON-LD blocks (`type="application/ld+json"`) are data, not scripts: CSP
 * does not apply to them.
 *
 * `style-src` keeps `'unsafe-inline'` on purpose: React and Framer Motion
 * render `style=""` attributes, and `experimental.inlineCss` ships Tailwind
 * in a `<style>` tag. CSS injection is a far smaller risk than script
 * injection.
 */

type CspDirectives = Record<string, string[]>;

function buildDirectives(isDev: boolean): CspDirectives {
  return {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
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

/** The header value, the same for every page. */
export function buildContentSecurityPolicy(isDev: boolean): string {
  return Object.entries(buildDirectives(isDev))
    .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
    .join("; ");
}
