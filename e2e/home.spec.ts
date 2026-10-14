import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("loads with the hero and the main navigation", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Web Developer Houston TX/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Websites That Win Customers" })
    ).toBeVisible();

    const nav = page.getByRole("navigation").first();
    await expect(nav.getByRole("link", { name: "Services" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Pricing" })).toBeVisible();
  });
});
