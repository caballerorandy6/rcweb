/**
 * Datos legales y de contacto de la empresa.
 * Única fuente de verdad para dirección, teléfono y correos:
 * políticas legales, facturas PDF, pies de email y contenido.
 */
export const COMPANY = {
  name: "RC Web Solutions LLC",
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

/** "6403 Bazel Brook Dr, Missouri City, TX 77489" */
export const COMPANY_ADDRESS = `${COMPANY.address}, ${COMPANY.city}, ${COMPANY.state} ${COMPANY.zip}`;

/** "Missouri City, TX 77489" */
export const COMPANY_LOCATION = `${COMPANY.city}, ${COMPANY.state} ${COMPANY.zip}`;

/**
 * Fecha de la última revisión de Privacy, Terms y Refund. Cambiarla aquí
 * actualiza las tres páginas y la versión que se guarda con cada aceptación.
 */
export const LEGAL_LAST_UPDATED = {
  /** Se guarda en TermsAcceptance.termsVersion */
  version: "2026-10-23",
  /** Texto visible en las páginas legales */
  label: "October 23, 2026",
} as const;
