import { expect, test, type Page } from "@playwright/test";

// Admin contacts and invoices: the dashboard shortcut opens the "new contact"
// form, a hand-made lead gets a pipeline status and can be deleted after an
// inline confirmation; the invoices page shares the dashboard's revenue figure.
// Uses the local test admin from .env.test (created by `npm run seed:dev`).
const email = process.env.TEST_ADMIN_EMAIL;
const password = process.env.TEST_ADMIN_PASSWORD;

async function signIn(page: Page) {
  await page.goto("/admin/login");
  await page.getByPlaceholder("Email").fill(email!);
  await page.getByPlaceholder("Password").fill(password!);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/admin-dashboard$/, { timeout: 15_000 });
}

test.describe("admin contacts", () => {
  test.skip(!email || !password, "TEST_ADMIN_EMAIL / TEST_ADMIN_PASSWORD not set");

  test("adds a lead by hand, moves it through the pipeline and deletes it", async ({ page }) => {
    const stamp = Date.now().toString();
    const name = `E2E Lead ${stamp}`;
    const contactEmail = `lead-e2e-${stamp}@rcweb.test`;
    // Phones are unique in the database: one per run
    const phone = `346${stamp.slice(-7)}`;

    await signIn(page);

    await test.step("the dashboard shortcut opens the form", async () => {
      await page.getByRole("link", { name: /Add contact/i }).click();
      await expect(page).toHaveURL(/\/contacts\?action=new$/);
      await expect(page.getByRole("heading", { level: 1, name: "Contacts" })).toBeVisible();
      await expect(page.getByRole("heading", { level: 2, name: "New contact" })).toBeVisible();
    });

    await test.step("save the contact", async () => {
      await page.getByLabel("Name", { exact: true }).fill(name);
      await page.getByLabel("Email", { exact: true }).fill(contactEmail);
      await page.getByLabel("Phone", { exact: true }).fill(phone);
      await page.getByLabel("Interested in").selectOption("website-redesign");
      await page.getByRole("button", { name: "Save contact" }).click();

      await expect(page.getByRole("heading", { level: 2, name: "New contact" })).toBeHidden({ timeout: 15_000 });
    });

    const row = page.getByRole("row", { name: new RegExp(contactEmail) });

    await test.step("the new lead is listed as manual and new", async () => {
      await expect(row).toBeVisible({ timeout: 15_000 });
      await expect(row).toContainText("manual");
      await expect(row).toContainText("Website Redesign");
      await expect(row.getByLabel(`Lead status for ${name}`)).toHaveValue("NEW");
    });

    await test.step("change the lead status", async () => {
      await row.getByLabel(`Lead status for ${name}`).selectOption("CONTACTED");
      await expect(page.getByText(`${name}: Contacted`)).toBeVisible({ timeout: 15_000 });
      await page.reload();
      await expect(row.getByLabel(`Lead status for ${name}`)).toHaveValue("CONTACTED");
    });

    await test.step("the search narrows the list", async () => {
      const search = page.getByLabel("Search contacts");
      await search.fill(contactEmail);
      await expect(row).toBeVisible();
      await expect(page.getByRole("row")).toHaveCount(2); // header + the lead

      await search.fill("nobody-matches-this@rcweb.test");
      await expect(page.getByText("No contacts match that search.")).toBeVisible();
      await search.clear();
      await expect(row).toBeVisible();
    });

    await test.step("deleting asks for confirmation first", async () => {
      await row.getByRole("button", { name: "Delete" }).click();
      await expect(row.getByText(`Delete ${name}?`)).toBeVisible();
      await row.getByRole("button", { name: "Keep" }).click();
      await expect(row.getByRole("button", { name: "Delete" })).toBeVisible();

      await row.getByRole("button", { name: "Delete" }).click();
      await row.getByRole("button", { name: "Yes, delete" }).click();
      await expect(row).toHaveCount(0, { timeout: 15_000 });
    });
  });
});

test.describe("admin invoices", () => {
  test.skip(!email || !password, "TEST_ADMIN_EMAIL / TEST_ADMIN_PASSWORD not set");

  test("shows the invoices with the dashboard's revenue", async ({ page }) => {
    await signIn(page);

    // Revenue (Month) card: "Total: $X" is the figure the invoices page must repeat
    const revenueCard = page.getByText("Revenue (Month)").locator("..");
    await expect(revenueCard).toBeVisible();
    const total = (await revenueCard.textContent())?.match(/Total: (\$[\d,]+)/)?.[1];

    await page.goto("/manage-invoices");
    await expect(page.getByRole("heading", { level: 1, name: "Invoices" })).toBeVisible();
    await expect(page.getByText("Total invoices")).toBeVisible();
    await expect(page.getByText("Total revenue")).toBeVisible();
    if (total) {
      await expect(page.getByText("Total revenue").locator("..")).toContainText(total);
    }
  });
});
