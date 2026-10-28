import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { syncSearchConsole } from "@/lib/searchConsole/sync";

// Cron diario de Vercel (vercel.json). Vercel llama con
// `Authorization: Bearer ${CRON_SECRET}`; cualquier otra llamada recibe 401.
export const dynamic = "force-dynamic";

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const received = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const outcome = await syncSearchConsole();
  if (!outcome.ok) {
    return NextResponse.json(outcome, { status: outcome.error === "not_configured" ? 503 : 502 });
  }
  return NextResponse.json(outcome);
}
