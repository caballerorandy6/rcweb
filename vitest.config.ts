import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    // Keep unit tests isolated from the local .env
    env: { DATABASE_CA_CERT: "", ADMIN_EMAIL: "" },
  },
});
