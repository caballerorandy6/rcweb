import { defineRouting } from "next-intl/routing";

/**
 * Two locales. English is the default and keeps the historical URLs with no
 * prefix (`/about`); Spanish lives under `/es` with translated slugs
 * (`/es/sobre-mi`). Nobody is redirected by browser language or cookie: the
 * URL alone decides, and the EN/ES switch in the header changes it. Google
 * recommends exactly that for crawlable localized pages.
 *
 * `pathnames` lists every public page once, in both languages. Admin pages
 * are not here: they have no Spanish version and keep the same path.
 */
export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
  localeCookie: false,
  // hreflang goes in <head> and in the sitemap (genPageMetadata), where each
  // page can decide whether a Spanish version exists; no Link header here.
  alternateLinks: false,
  pathnames: {
    "/": "/",
    "/about": { en: "/about", es: "/sobre-mi" },
    "/services": { en: "/services", es: "/servicios" },
    "/services/[slug]": { en: "/services/[slug]", es: "/servicios/[slug]" },
    "/projects-portfolio": { en: "/projects-portfolio", es: "/portafolio" },
    "/case-study/clinica-gessner": {
      en: "/case-study/clinica-gessner",
      es: "/casos-de-exito/clinica-gessner",
    },
    "/case-study/clinica-airline": {
      en: "/case-study/clinica-airline",
      es: "/casos-de-exito/clinica-airline",
    },
    "/case-study/leos-home-experts": {
      en: "/case-study/leos-home-experts",
      es: "/casos-de-exito/leos-home-experts",
    },
    "/case-study/dulce-antojo": {
      en: "/case-study/dulce-antojo",
      es: "/casos-de-exito/dulce-antojo",
    },
    "/case-study/gsmactx": {
      en: "/case-study/gsmactx",
      es: "/casos-de-exito/gsmactx",
    },
    "/web-developer-houston-tx": {
      en: "/web-developer-houston-tx",
      es: "/desarrollador-web-houston-tx",
    },
    "/schedule": { en: "/schedule", es: "/agendar" },
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/thank-you": { en: "/thank-you", es: "/gracias" },
    "/privacy-policy": { en: "/privacy-policy", es: "/politica-de-privacidad" },
    "/terms-of-service": { en: "/terms-of-service", es: "/terminos-de-servicio" },
    "/refund-policy": { en: "/refund-policy", es: "/politica-de-reembolso" },
    "/manage-subscription": {
      en: "/manage-subscription",
      es: "/gestionar-suscripcion",
    },
    "/manage-subscription/[token]": {
      en: "/manage-subscription/[token]",
      es: "/gestionar-suscripcion/[token]",
    },
    "/unsubscribe": { en: "/unsubscribe", es: "/cancelar-suscripcion" },
    "/quote/[token]": { en: "/quote/[token]", es: "/presupuesto/[token]" },
    "/pay/[token]": { en: "/pay/[token]", es: "/pagar/[token]" },
    "/project/[accessToken]": {
      en: "/project/[accessToken]",
      es: "/proyecto/[accessToken]",
    },
    "/final-payment": { en: "/final-payment", es: "/pago-final" },
    "/payment-success": { en: "/payment-success", es: "/pago-exitoso" },
    "/payment-complete": { en: "/payment-complete", es: "/pago-completado" },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
