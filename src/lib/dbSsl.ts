import { checkServerIdentity } from "node:tls";
import type { ConnectionOptions } from "node:tls";

// Railway's Postgres certificate is issued by a private CA for its internal
// hostname, not for the public proxy host we connect through. We pin that CA
// and verify the name the certificate really carries.
const DB_CERT_HOSTNAME = "postgres.railway.internal";

/**
 * TLS options for the database connection.
 * Returns undefined when DATABASE_CA_CERT is not set (local development).
 */
export function getDbSsl(): ConnectionOptions | undefined {
  const ca = process.env.DATABASE_CA_CERT;
  if (!ca) return undefined;

  return {
    ca,
    checkServerIdentity: (_host, cert) =>
      checkServerIdentity(DB_CERT_HOSTNAME, cert),
  };
}
