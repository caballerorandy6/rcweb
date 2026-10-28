import { timingSafeEqual } from "node:crypto";

/**
 * Vercel llama a los crons de vercel.json con `Authorization: Bearer ${CRON_SECRET}`.
 * Cualquier otra llamada (o un CRON_SECRET sin definir) se rechaza.
 */
export function isCronRequestAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const received = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return received.length === expected.length && timingSafeEqual(received, expected);
}
