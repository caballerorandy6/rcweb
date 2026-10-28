/**
 * Autorización de un solo uso para la Google Business Profile API (etapa 6e).
 *
 * Abre el consentimiento de Google con el cliente OAuth «rcweb Google reviews
 * sync», cambia el código por un refresh token, descubre la cuenta y la
 * ubicación del perfil y deja las tres variables en `.env`:
 *   GOOGLE_OAUTH_REFRESH_TOKEN, GBP_ACCOUNT_ID, GBP_LOCATION_ID
 * Después hay que copiarlas a Vercel (`vercel env add …`).
 *
 * Uso: npx tsx scripts/google-reviews-auth.ts ["texto del título de la ubicación"]
 * El argumento elige la ubicación cuando la cuenta gestiona varias.
 * Requiere GOOGLE_OAUTH_CLIENT_ID y GOOGLE_OAUTH_CLIENT_SECRET en `.env`.
 * El refresh token no se imprime nunca; solo se escribe en el archivo.
 */
import { config } from "dotenv";
import { createHash, randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";

config();

const SCOPE = "https://www.googleapis.com/auth/business.manage";
const ENV_FILE = ".env";

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  console.error("Faltan GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET en .env");
  process.exit(1);
}

const base64url = (buffer: Buffer) => buffer.toString("base64url");
const codeVerifier = base64url(randomBytes(48));
const codeChallenge = base64url(createHash("sha256").update(codeVerifier).digest());
const state = base64url(randomBytes(16));

async function googleGet<T>(url: string, accessToken: string): Promise<T> {
  const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!response.ok) {
    throw new Error(`${url} → ${response.status}: ${(await response.text()).slice(0, 400)}`);
  }
  return (await response.json()) as T;
}

function upsertEnv(entries: Record<string, string>) {
  let content = readFileSync(ENV_FILE, "utf8");
  for (const [key, value] of Object.entries(entries)) {
    const line = `${key}=${value}`;
    const pattern = new RegExp(`^${key}=.*$`, "m");
    content = pattern.test(content)
      ? content.replace(pattern, line)
      : `${content.replace(/\n*$/, "\n")}${line}\n`;
  }
  writeFileSync(ENV_FILE, content);
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");
  if (url.pathname !== "/callback") {
    response.writeHead(404).end();
    return;
  }
  try {
    if (url.searchParams.get("state") !== state) throw new Error("state inválido");
    const error = url.searchParams.get("error");
    if (error) throw new Error(`Google devolvió error=${error}`);
    const code = url.searchParams.get("code");
    if (!code) throw new Error("falta el código de autorización");

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        code_verifier: codeVerifier,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });
    if (!tokenResponse.ok) {
      throw new Error(`token → ${tokenResponse.status}: ${(await tokenResponse.text()).slice(0, 400)}`);
    }
    const tokens = (await tokenResponse.json()) as {
      access_token: string;
      refresh_token?: string;
      scope: string;
    };
    if (!tokens.refresh_token) {
      throw new Error("Google no devolvió refresh_token (revoca el acceso en myaccount.google.com/permissions y repite)");
    }
    if (!tokens.scope.includes(SCOPE)) throw new Error(`scope concedido: ${tokens.scope}`);

    const { accounts = [] } = await googleGet<{
      accounts?: Array<{ name: string; accountName: string; type: string }>;
    }>("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", tokens.access_token);
    console.log(`Cuentas: ${accounts.map((a) => `${a.name} «${a.accountName}» (${a.type})`).join(", ") || "ninguna"}`);

    const found: Array<{ accountId: string; locationId: string; title: string }> = [];
    for (const account of accounts) {
      const { locations = [] } = await googleGet<{
        locations?: Array<{ name: string; title: string }>;
      }>(
        `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title&pageSize=100`,
        tokens.access_token
      );
      for (const location of locations) {
        found.push({
          accountId: account.name.replace("accounts/", ""),
          locationId: location.name.replace("locations/", ""),
          title: location.title,
        });
      }
    }
    console.log(`Ubicaciones: ${found.map((l) => `${l.accountId}/${l.locationId} «${l.title}»`).join(", ") || "ninguna"}`);
    const wanted = process.argv[2]?.toLowerCase();
    const matches = wanted ? found.filter((l) => l.title.toLowerCase().includes(wanted)) : found;
    if (matches.length !== 1) {
      throw new Error(
        `Hay ${matches.length} ubicaciones candidatas; pasa parte del título como argumento para elegir una`
      );
    }
    const [location] = matches;

    const reviews = await googleGet<{ averageRating?: number; totalReviewCount?: number }>(
      `https://mybusiness.googleapis.com/v4/accounts/${location.accountId}/locations/${location.locationId}/reviews?pageSize=1`,
      tokens.access_token
    );
    console.log(
      `reviews.list OK: nota media ${reviews.averageRating ?? "-"}, total ${reviews.totalReviewCount ?? 0}`
    );

    upsertEnv({
      GOOGLE_OAUTH_REFRESH_TOKEN: tokens.refresh_token,
      GBP_ACCOUNT_ID: location.accountId,
      GBP_LOCATION_ID: location.locationId,
    });
    console.log("Escrito en .env: GOOGLE_OAUTH_REFRESH_TOKEN, GBP_ACCOUNT_ID, GBP_LOCATION_ID");

    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end("<p>Listo. Ya puedes cerrar esta pestaña.</p>");
    server.close();
  } catch (error) {
    console.error("ERROR:", error instanceof Error ? error.message : error);
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(String(error instanceof Error ? error.message : error));
    server.close();
    process.exitCode = 1;
  }
});

let redirectUri = "";
server.listen(0, "127.0.0.1", () => {
  const { port } = server.address() as AddressInfo;
  redirectUri = `http://127.0.0.1:${port}/callback`;
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "consent",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    state,
  }).toString();
  console.log("Abre esta URL con la cuenta dueña del perfil:\n" + authUrl.toString());
});
