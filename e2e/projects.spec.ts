import { expect, test, type Page } from "@playwright/test";

// Admin projects: the list links to a detail page with the customer, both
// charges, the customer links and milestones edited in place. Nothing that
// emails the customer is pressed: the status button ("ready for payment") and
// "Notify customer" on a completed milestone.
// Uses the local test admin and the TEST-001 project from `npm run seed:dev`.
const email = process.env.TEST_ADMIN_EMAIL;
const password = process.env.TEST_ADMIN_PASSWORD;

async function signIn(page: Page) {
  await page.goto("/admin/login");
  await page.getByPlaceholder("Email").fill(email!);
  await page.getByPlaceholder("Password").fill(password!);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/admin-dashboard$/, { timeout: 15_000 });
}

test.describe("admin projects", () => {
  test.skip(!email || !password, "TEST_ADMIN_EMAIL / TEST_ADMIN_PASSWORD not set");

  test("opens a project and manages its milestones in place", async ({ page }) => {
    const stamp = Date.now();
    const title = `E2E milestone ${stamp}`;

    await signIn(page);

    await test.step("the list shows the seeded project with its charges", async () => {
      await page.goto("/projects");
      await expect(page.getByRole("heading", { level: 1, name: "Projects" })).toBeVisible();
      const row = page.getByRole("row", { name: /TEST-001/ });
      await expect(row).toContainText("Deposit: paid");
      await expect(row).toContainText("Final: pending");
      await row.getByRole("link", { name: "View" }).click();
    });

    await test.step("the detail page has the customer, payments and links", async () => {
      await expect(page).toHaveURL(/\/projects\/[0-9a-f-]{36}$/);
      await expect(page.getByRole("heading", { level: 1, name: /Project TEST-001/ })).toBeVisible();

      const customer = page.getByRole("region", { name: "Customer", exact: true });
      // Seed data may differ between machines; the shape is what matters
      await expect(customer).toContainText(/Name\s*Test \w+/);
      await expect(customer).toContainText(/@rcweb\.test/);

      const payments = page.getByRole("region", { name: "Payments" });
      await expect(payments).toContainText("$1,000.00");
      await expect(payments.getByText("Paid", { exact: true })).toBeVisible();
      await expect(payments.getByText("Pending", { exact: true })).toBeVisible();

      const links = page.getByRole("region", { name: "Customer links" });
      await expect(links).toContainText("/project/");
      await expect(links).toContainText("/pay/");
      await expect(links.getByRole("button", { name: "Copy" })).toHaveCount(2);
    });

    const milestones = page.getByRole("region", { name: "Milestones" });

    await test.step("add a milestone", async () => {
      await milestones.getByRole("button", { name: "Add milestone" }).click();
      await milestones.getByLabel("Milestone title").fill(title);
      await milestones.getByLabel("Description").fill("Added by the E2E suite");
      await milestones.getByRole("button", { name: "Add milestone" }).click();

      const item = milestones.getByRole("listitem").filter({ hasText: title });
      await expect(item).toBeVisible({ timeout: 15_000 });
      await expect(item).toContainText("Added by the E2E suite");
    });

    const item = milestones.getByRole("listitem").filter({ hasText: title });

    await test.step("start it, then complete it without emailing the customer", async () => {
      await item.getByRole("button", { name: "Start" }).click();
      await expect(item.getByRole("button", { name: "Complete" })).toBeVisible({ timeout: 15_000 });
      // The suite has no Resend key: skip the email and check the retry button instead
      await milestones.getByRole("checkbox", { name: /when a milestone is completed/ }).uncheck();
      await item.getByRole("button", { name: "Complete" }).click();
      await expect(item).toContainText("Completed", { timeout: 15_000 });
      await expect(item).not.toContainText("Customer notified");
      await expect(item.getByRole("button", { name: "Notify customer" })).toBeVisible();
    });

    await test.step("the public progress page lists it", async () => {
      const progressUrl = await page
        .getByRole("region", { name: "Customer links" })
        .locator("p.font-mono")
        .first()
        .innerText();
      // The link carries NEXT_PUBLIC_BASE_URL; the test server has its own port
      await page.goto(new URL(progressUrl).pathname);
      await expect(page.getByText(title)).toBeVisible();
      await page.goBack();
    });

    await test.step("delete it with the inline confirmation", async () => {
      await item.getByRole("button", { name: "Delete" }).click();
      await expect(item).toContainText("Delete this milestone?");
      await item.getByRole("button", { name: "Yes, delete" }).click();
      await expect(milestones.getByRole("listitem").filter({ hasText: title })).toHaveCount(0, {
        timeout: 15_000,
      });
    });
  });
});
