import { expect, test } from "@playwright/test";

// Five failed attempts lock an account for 15 minutes. A made-up address is
// used so the real test admin is never locked for the other tests.
test("locks the account after five failed attempts", async ({ page }) => {
  const email = `lockout-${Date.now()}@rcweb.test`;

  await page.goto("/admin/login");

  for (let attempt = 1; attempt <= 5; attempt++) {
    await page.getByPlaceholder("Email").fill(email);
    // 8+ characters so the form's own validation lets the request through
    await page.getByPlaceholder("Password").fill(`wrong-password-${attempt}`);
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page.getByText("Invalid email or password").last()).toBeVisible();
  }

  await page.getByPlaceholder("Password").fill("wrong-password-6");
  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(
    page.getByText("Too many failed attempts. Please try again in 15 minutes.")
  ).toBeVisible();
});
