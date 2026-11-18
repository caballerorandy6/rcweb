// Values the test server is started with (playwright.config.ts → webServer.env)
// and the suite needs to know.

/** Secret the suite signs Stripe events with; the server verifies with the same one */
export const E2E_WEBHOOK_SECRET = "whsec_e2e_suite_only";
