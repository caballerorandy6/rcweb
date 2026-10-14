import { NextResponse } from "next/server";

// Throws on purpose so a deployment can confirm errors reach Sentry.
// Disabled in production.
export async function GET() {
  if (process.env.VERCEL_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  throw new Error("Sentry check: this error is expected");
}
