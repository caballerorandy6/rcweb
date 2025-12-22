import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.INTERNAL_API_KEY;

/**
 * Validates API key from request headers
 * Use this for internal API endpoints (n8n, webhooks, etc.)
 */
export function validateApiKey(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.substring(7);
  return token === API_KEY;
}

/**
 * Returns 401 response for unauthorized API requests
 */
export function unauthorizedResponse(message = "Unauthorized"): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 401 }
  );
}
