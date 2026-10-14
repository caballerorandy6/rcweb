import { defineConfig, devices } from "@playwright/test";
import { config as loadEnv } from "dotenv";

// End-to-end smoke tests. They run against a real Next.js server that
// Playwright starts on its own (see webServer below).
const PORT = 3100;

// Test accounts seeded by `npm run seed:dev`
loadEnv({ path: ".env.test" });

export default defineConfig({
  testDir: "./e2e",
  // Each test gets a fresh browser context: no cookies or storage shared
  fullyParallel: true,
  // Never leave a test.only in CI by mistake
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // In CI: annotations on the PR plus an HTML report uploaded as an artifact
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    // Keep a trace of the first retry so a flaky failure can be inspected
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npx next dev -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    // Locally reuse a dev server that is already running on that port
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
