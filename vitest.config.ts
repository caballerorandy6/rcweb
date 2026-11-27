import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    // Keep unit tests isolated from the local .env
    // AUTH_SECRET signs the unsubscribe links of the email templates
    env: { DATABASE_CA_CERT: "", ADMIN_EMAIL: "", AUTH_SECRET: "vitest-only-secret" },
  },
});
