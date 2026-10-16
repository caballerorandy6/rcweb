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
  website: "www.rcweb.dev",
  url: "https://rcweb.dev",
} as const;

/** "6403 Bazel Brook Dr, Missouri City, TX 77489" */
export const COMPANY_ADDRESS = `${COMPANY.address}, ${COMPANY.city}, ${COMPANY.state} ${COMPANY.zip}`;

/** "Missouri City, TX 77489" */
export const COMPANY_LOCATION = `${COMPANY.city}, ${COMPANY.state} ${COMPANY.zip}`;
