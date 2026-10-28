import { NextResponse } from "next/server";
import { isCronRequestAuthorized } from "@/lib/cronAuth";
import { syncSearchConsole } from "@/lib/searchConsole/sync";

// Cron diario de Vercel (vercel.json).
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isCronRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const outcome = await syncSearchConsole();
  if (!outcome.ok) {
    return NextResponse.json(outcome, { status: outcome.error === "not_configured" ? 503 : 502 });
  }
  return NextResponse.json(outcome);
}
