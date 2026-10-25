import { COMPANY } from "@/lib/company";

export const SITE_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || COMPANY.url;

/** Public progress page for a project; the token is the only credential. */
export function getProjectUrl(accessToken: string): string {
  return `${SITE_BASE_URL}/project/${accessToken}`;
}

/** Magic link that sends the customer straight to the final-payment Checkout. */
export function getPayUrl(accessToken: string): string {
  return `${SITE_BASE_URL}/pay/${accessToken}`;
}
