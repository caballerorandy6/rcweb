import { expect, test, type Page } from "@playwright/test";

// Admin quotes: write a draft, see it in the list, edit it and withdraw it.
// Sending is not exercised here because it emails the customer through Resend.
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

test.describe("admin quotes", () => {
  test.skip(!email || !password, "TEST_ADMIN_EMAIL / TEST_ADMIN_PASSWORD not set");

  test("drafts, edits and withdraws a quote", async ({ page }) => {
    const stamp = Date.now();
    const customerName = `E2E Customer ${stamp}`;
    const customerEmail = `quote-e2e-${stamp}@rcweb.test`;

    await signIn(page);

    await test.step("write a draft based on a catalogue offer", async () => {
      await page.goto("/quotes/new");
      await expect(page.getByRole("heading", { level: 1, name: "New Quote" })).toBeVisible();

      await page.getByLabel("Customer name").fill(customerName);
      await page.getByLabel("Customer email").fill(customerEmail);
      // Picking an offer suggests its title and starting price
      await page.getByLabel("Based on").selectOption("website-redesign");
      await expect(page.getByLabel("Project name")).toHaveValue("Website Redesign & Modernization");
      await expect(page.getByLabel("Total (USD)")).toHaveValue("3500");

      await page.getByLabel("Total (USD)").fill("4200");
      await page.getByLabel("What's included").fill("- Migrate 8 pages\n\nNew mobile-first design\n");
      await page.getByRole("button", { name: "Save as Draft" }).click();

      await expect(page).toHaveURL(/\/quotes$/, { timeout: 15_000 });
    });

    const row = page.getByRole("row", { name: new RegExp(customerEmail) });

    await test.step("the draft is listed with its status and total", async () => {
      await expect(row).toBeVisible();
      await expect(row.getByText("Draft", { exact: true })).toBeVisible();
      // The total is rendered twice (desktop column and mobile stack); check the row text
      await expect(row).toContainText("$4,200.00");
      // A draft has no public link yet
      await expect(row.getByRole("button", { name: "Copy link" })).toHaveCount(0);
    });

    await test.step("edit keeps the scope as one item per line", async () => {
      await row.getByRole("link", { name: "Edit" }).click();
      await expect(page.getByRole("heading", { level: 1, name: /Edit Quote Q-\d{4}-\d+/ })).toBeVisible();
      await expect(page.getByLabel("What's included")).toHaveValue(
        "Migrate 8 pages\nNew mobile-first design"
      );

      await page.getByLabel("Project name").fill(`Redesign for ${customerName}`);
      await page.getByRole("button", { name: "Save Changes" }).click();

      await expect(page).toHaveURL(/\/quotes$/, { timeout: 15_000 });
      await expect(row).toContainText(`Redesign for ${customerName}`);
    });

    await test.step("withdrawing asks for confirmation first", async () => {
      await row.getByRole("button", { name: "Cancel" }).click();
      await expect(row.getByText("Withdraw this quote?")).toBeVisible();
      await row.getByRole("button", { name: "Yes, cancel" }).click();

      await expect(row.getByText("Cancelled", { exact: true })).toBeVisible({ timeout: 15_000 });
      await expect(row.getByRole("link", { name: "Edit" })).toHaveCount(0);
    });
  });

  test("the form rejects a quote without scope", async ({ page }) => {
    await signIn(page);
    await page.goto("/quotes/new");

    await page.getByLabel("Customer name").fill("No Scope");
    await page.getByLabel("Customer email").fill("no-scope@rcweb.test");
    await page.getByLabel("Project name").fill("Something custom");
    await page.getByLabel("Total (USD)").fill("1500");
    await page.getByRole("button", { name: "Save as Draft" }).click();

    await expect(page.getByText("Add at least one scope item")).toBeVisible();
    await expect(page).toHaveURL(/\/quotes\/new$/);
  });
});

test.describe("public quote page", () => {
  test("an unknown token is a 404", async ({ page }) => {
    const response = await page.goto("/quote/00000000-0000-4000-8000-000000000000");
    expect(response?.status()).toBe(404);
  });

  test("a malformed token is a 404", async ({ page }) => {
    const response = await page.goto("/quote/not-a-token");
    expect(response?.status()).toBe(404);
  });
});
