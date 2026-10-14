import { expect, test } from "@playwright/test";

// Every public page must render (no 500) with exactly one visible h1.
const pages = ["/services", "/about", "/blog", "/schedule", "/projects-portfolio"];

for (const path of pages) {
  test(`${path} renders with a single h1`, async ({ page }) => {
    const response = await page.goto(path);

    expect(response?.status()).toBe(200);
    const headings = page.getByRole("heading", { level: 1 });
    await expect(headings.first()).toBeVisible();
    await expect(headings).toHaveCount(1);
  });
}
