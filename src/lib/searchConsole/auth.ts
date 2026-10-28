import { getVercelOidcToken } from "@vercel/oidc";
import { ExternalAccountClient, type BaseExternalAccountClient } from "google-auth-library";
import type { SearchConsoleConfig } from "@/lib/searchConsole/config";

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

let cached: { key: string; client: BaseExternalAccountClient } | null = null;

/**
 * Cliente de Google que intercambia el token OIDC de Vercel por un access token
 * de la cuenta de servicio (STS → generateAccessToken). Cacheado por proceso:
 * google-auth-library renueva el token de Google solo cuando caduca.
 */
export function getGoogleAuthClient(config: SearchConsoleConfig): BaseExternalAccountClient {
  const key = `${config.GCP_PROJECT_NUMBER}/${config.GCP_WORKLOAD_IDENTITY_POOL_ID}/${config.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}/${config.GCP_SERVICE_ACCOUNT_EMAIL}`;
  if (cached?.key === key) return cached.client;

  const client = ExternalAccountClient.fromJSON({
    type: "external_account",
    audience: `//iam.googleapis.com/projects/${config.GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${config.GCP_WORKLOAD_IDENTITY_POOL_ID}/providers/${config.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`,
    subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
    token_url: "https://sts.googleapis.com/v1/token",
    service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${config.GCP_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
    subject_token_supplier: {
      // En Vercel el token viene inyectado; en local lo trae `vercel env pull` (~12 h).
      getSubjectToken: () => getVercelOidcToken(),
    },
  });
  if (!client) {
    throw new Error("Could not build the Google external account client");
  }
  client.scopes = [SCOPE];

  cached = { key, client };
  return client;
}

/** Access token de Google para la API de Search Console. */
export async function getSearchConsoleAccessToken(config: SearchConsoleConfig): Promise<string> {
  const { token } = await getGoogleAuthClient(config).getAccessToken();
  if (!token) throw new Error("Google did not return an access token");
  return token;
}
