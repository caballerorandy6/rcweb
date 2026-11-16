import { NextResponse } from "next/server";
import { isCronRequestAuthorized } from "@/lib/cronAuth";
import { syncGoogleReviews } from "@/lib/googleReviews/sync";

// Cron semanal de Vercel (vercel.json): refresca nota, total y reseñas del
// perfil de Google y regenera la home.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isCronRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const outcome = await syncGoogleReviews();
  if (!outcome.ok) {
    return NextResponse.json(outcome, { status: outcome.error === "not_configured" ? 503 : 502 });
  }
  return NextResponse.json(outcome);
}
