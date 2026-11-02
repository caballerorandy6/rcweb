/**
 * Each service's slug per language. Kept apart from the catalogue in
 * `lib/data` so the EN/ES switch, a client component, can use it without
 * pulling the catalogue into the browser. A test keeps both in step.
 */
export const SERVICE_SLUGS = [
  { en: "web-design-houston", es: "diseno-web-houston" },
  { en: "website-redesign-houston", es: "rediseno-web-houston" },
  { en: "admin-dashboard-houston", es: "panel-de-administracion-houston" },
  { en: "ecommerce-houston", es: "tienda-en-linea-houston" },
  { en: "website-maintenance-houston", es: "mantenimiento-web-houston" },
] as const;

/** The same service's slug in another language; an unknown slug stays as it is */
export function translateServiceSlug(slug: string, target: "en" | "es"): string {
  return SERVICE_SLUGS.find((pair) => pair.en === slug || pair.es === slug)?.[target] ?? slug;
}
