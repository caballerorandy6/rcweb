import { expect, test } from "@playwright/test";

// Uses the local test admin from .env.test (created by `npm run seed:dev`).
const email = process.env.TEST_ADMIN_EMAIL;
const password = process.env.TEST_ADMIN_PASSWORD;

test.describe("admin login", () => {
  test.skip(!email || !password, "TEST_ADMIN_EMAIL / TEST_ADMIN_PASSWORD not set");

  test("rejects a wrong password", async ({ page }) => {
    await page.goto("/admin/login");

    await page.getByPlaceholder("Email").fill(email!);
    await page.getByPlaceholder("Password").fill("definitely-wrong");
    await page.getByRole("button", { name: "Sign In" }).click();

    // The first sign-in request compiles the auth route on the CI dev server
    await expect(page.getByText("Invalid email or password")).toBeVisible({ timeout: 15_000 });
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test("signs in and lands on the dashboard", async ({ page }) => {
    await page.goto("/admin/login");

    await page.getByPlaceholder("Email").fill(email!);
    await page.getByPlaceholder("Password").fill(password!);
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page).toHaveURL(/\/admin-dashboard$/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { level: 1, name: "Dashboard" })).toBeVisible();
  });

  test("redirects anonymous visitors away from the dashboard", async ({ page }) => {
    await page.goto("/admin-dashboard");

    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
