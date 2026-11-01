import { expect, test } from "@playwright/test";

// Every public page must render (no 500) with exactly one visible h1, in
// both languages (Spanish lives under /es with translated slugs).
const pages = [
  "/services",
  "/about",
  "/blog",
  "/blog/how-much-does-a-website-cost-houston-2026",
  "/schedule",
  "/projects-portfolio",
  "/privacy-policy",
  "/terms-of-service",
  "/refund-policy",
  "/es",
  "/es/servicios",
  "/es/sobre-mi",
  "/es/blog",
  "/es/blog/how-much-does-a-website-cost-houston-2026",
  "/es/agendar",
  "/es/portafolio",
  "/es/politica-de-privacidad",
  "/es/terminos-de-servicio",
  "/es/politica-de-reembolso",
];

for (const path of pages) {
  test(`${path} renders with a single h1`, async ({ page }) => {
    const response = await page.goto(path);

    expect(response?.status()).toBe(200);
    const headings = page.getByRole("heading", { level: 1 });
    await expect(headings.first()).toBeVisible();
    await expect(headings).toHaveCount(1);
  });
}

test("the Spanish privacy policy keeps the shared anchors and the measurement switch", async ({ page }) => {
  await page.goto("/es/politica-de-privacidad#cookies");
  await expect(page.locator("section#cookies")).toBeVisible();
  await expect(page.locator("section#youtube")).toBeAttached();
  await expect(page.getByRole("checkbox", { name: /Google Analytics/ })).toBeVisible();
});

test("an unknown page is a 404 titled in the page language", async ({ page }) => {
  const english = await page.goto("/this-page-does-not-exist");
  expect(english?.status()).toBe(404);
  await expect(page).toHaveTitle(/Page Not Found/);

  const spanish = await page.goto("/es/esta-pagina-no-existe");
  expect(spanish?.status()).toBe(404);
  await expect(page).toHaveTitle(/Página no encontrada/);
});
