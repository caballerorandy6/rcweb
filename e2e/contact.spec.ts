import { expect, test } from "@playwright/test";

// The contact form is the lead entry point. These tests exercise the
// client-side validation only; they never submit (that would hit reCAPTCHA
// and send real emails).
test.describe("contact form", () => {
  test("shows a validation message for every required field", async ({ page }) => {
    await page.goto("/#contact");
    const form = page.locator("#contact form");

    await form.getByRole("button", { name: "Send Message" }).click();

    await expect(form.getByText("Name is too short")).toBeVisible();
    await expect(form.getByText("Invalid email address")).toBeVisible();
    await expect(form.getByText("Phone number is too short")).toBeVisible();
  });

  test("clears the messages once the fields are valid", async ({ page }) => {
    await page.goto("/#contact");
    const form = page.locator("#contact form");

    await form.getByRole("button", { name: "Send Message" }).click();
    await expect(form.getByText("Name is too short")).toBeVisible();

    await form.getByPlaceholder("Full Name").fill("Ana Test");
    await form.getByPlaceholder("Email").fill("ana@example.com");
    await form.getByPlaceholder("Phone Number").fill("3463757534");

    await expect(form.getByText("Name is too short")).toBeHidden();
    await expect(form.getByText("Invalid email address")).toBeHidden();
    await expect(form.getByText("Phone number is too short")).toBeHidden();
  });

  test("rejects a malformed email", async ({ page }) => {
    await page.goto("/#contact");
    const form = page.locator("#contact form");
    const email = form.getByPlaceholder("Email");

    // The input is type="email", so the browser itself blocks obviously
    // broken values before React Hook Form runs: no Zod message appears.
    await email.fill("ana@");
    await form.getByRole("button", { name: "Send Message" }).click();
    expect(await email.evaluate((el: HTMLInputElement) => el.validity.valid)).toBe(false);
    await expect(form.getByText("Invalid email address")).toBeHidden();

    // A value the browser accepts but Zod does not (no top-level domain)
    await email.fill("ana@localhost");
    await form.getByRole("button", { name: "Send Message" }).click();
    await expect(form.getByText("Invalid email address")).toBeVisible();
  });
});
