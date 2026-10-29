/**
 * Datos legales y de contacto de la empresa.
 * Única fuente de verdad para teléfono, correos y dirección postal.
 *
 * La dirección postal es la casa de Randy: NO se muestra en la web, las
 * políticas legales ni las facturas. Solo va donde la ley la exige
 * (CAN-SPAM: pie de cada correo comercial). Usa COMPANY_POSTAL_ADDRESS
 * únicamente en plantillas de marketing.
 */
export const COMPANY = {
  name: "RC Web Solutions LLC",
  /** Solo para el pie de correos comerciales (CAN-SPAM). */
  address: "6403 Bazel Brook Dr",
  city: "Missouri City",
  state: "TX",
  zip: "77489",
  country: "USA",
  email: "admin@rcweb.dev",
  contactEmail: "contactus@rcweb.dev",
  phone: "+1 (346) 375-7534",
  phoneDisplay: "(346) 375-7534",
  phoneHref: "tel:+13463757534",
  /** Personal WhatsApp line (not the Twilio number) */
  whatsappNumber: "+1 (832) 546-5983",
  whatsappHref:
    "https://wa.me/18325465983?text=Hi%20Randy%2C%20I%27m%20interested%20in%20discussing%20a%20web%20project",
  website: "www.rcweb.dev",
  url: "https://www.rcweb.dev",
} as const;

/**
 * Dirección postal completa, exigida por CAN-SPAM en correos comerciales.
 * No usarla en páginas públicas, políticas ni facturas.
 */
export const COMPANY_POSTAL_ADDRESS = `${COMPANY.address}, ${COMPANY.city}, ${COMPANY.state} ${COMPANY.zip}`;

/**
 * Fecha de la última revisión de Privacy, Terms y Refund. Cambiarla aquí
 * actualiza las tres páginas y la versión que se guarda con cada aceptación.
 */
export const LEGAL_LAST_UPDATED = {
  /** Se guarda en TermsAcceptance.termsVersion */
  version: "2026-10-29",
  /** Texto visible en las páginas legales */
  label: "October 29, 2026",
} as const;
