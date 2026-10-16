import { COMPANY } from "@/lib/company";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || COMPANY.url;

/** Public progress page for a project; the token is the only credential. */
export function getProjectUrl(accessToken: string): string {
  return `${BASE_URL}/project/${accessToken}`;
}
