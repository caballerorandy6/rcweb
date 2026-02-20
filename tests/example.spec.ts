import { test, expect } from "@playwright/test";

/**
 * RC Web Solutions - E2E Tests
 * Basic smoke tests for critical pages
 */

test.describe("Homepage", () => {
  test("has correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/RC Web Solutions/);
  });

  test("displays hero section", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("section").first();
    await expect(hero).toBeVisible();
  });

  test("has navigation", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
  });

  test("has skip link for accessibility", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
  });
});

test.describe("Blog", () => {
  test("blog page loads", async ({ page }) => {
    await page.goto("/blog");
    await expect(page).toHaveURL(/blog/);
  });
});

test.describe("Schedule", () => {
  test("schedule page loads", async ({ page }) => {
    await page.goto("/schedule");
    await expect(page).toHaveURL(/schedule/);
  });
});
