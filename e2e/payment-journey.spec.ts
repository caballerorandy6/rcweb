import { randomUUID } from "node:crypto";
import { expect, test, type Page } from "@playwright/test";
import {
  checkoutSession,
  db,
  deliverCheckoutCompleted,
  disconnect,
  hasLocalDatabase,
  projectCode,
} from "./support/payments";

// The 50/50 sale from end to end: quote → deposit → project → ready for
// payment → final payment → completed. Stripe is not called: its two
// checkout.session.completed events are delivered signed, the way the webhook
// receives them. Emails and invoice PDFs fail on purpose (the test server has
// no Resend key and no Blob token) and the money is recorded all the same.
const adminEmail = process.env.TEST_ADMIN_EMAIL;
const adminPassword = process.env.TEST_ADMIN_PASSWORD;

async function signIn(page: Page) {
  await page.goto("/admin/login");
  await page.getByPlaceholder("Email").fill(adminEmail!);
  await page.getByPlaceholder("Password").fill(adminPassword!);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page).toHaveURL(/\/admin-dashboard$/, { timeout: 15_000 });
}

test.describe("payment journey", () => {
  test.skip(!adminEmail || !adminPassword, "TEST_ADMIN_EMAIL / TEST_ADMIN_PASSWORD not set");
  test.skip(!hasLocalDatabase, "DATABASE_URL is not a local database");

  test.afterAll(disconnect);

  test("a quote becomes a project, is paid in two halves and ends completed", async ({ page, baseURL }) => {
    test.slow();
    const stamp = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const customerEmail = `journey-e2e-${stamp}@rcweb.test`;
    const planName = `Journey site ${stamp}`;
    const code = projectCode();
    // An odd total: the deposit takes the extra cent
    const total = 250_101;
    const depositAmount = 125_051;
    const finalAmount = 125_050;
    const depositTax = 8_253;
    const depositSessionId = `cs_test_e2e_deposit_${stamp}`;
    const finalSessionId = `cs_test_e2e_final_${stamp}`;

    // A quote already sent to a lead: sending it from the admin emails the
    // customer, which this suite never does
    const contact = await db().contact.create({
      data: {
        name: `Journey Lead ${stamp}`,
        leadStatus: "PROPOSAL_SENT",
        emails: { create: { email: customerEmail } },
      },
    });
    const quote = await db().quote.create({
      data: {
        quoteNumber: `Q-E2E-${stamp}`,
        email: customerEmail,
        name: "Journey Customer",
        planName,
        scope: ["Design", "Build"],
        totalAmount: total,
        status: "sent",
        sentAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        contactId: contact.id,
      },
    });

    const depositSession = checkoutSession({
      id: depositSessionId,
      amount: depositAmount,
      tax: depositTax,
      metadata: {
        paymentType: "initial",
        projectCode: code,
        planName,
        customerName: "Journey Customer",
        customerEmail,
        firstPaymentAmount: String(depositAmount),
        secondPaymentAmount: String(finalAmount),
        totalAmount: String(total),
        termsAcceptedAt: new Date().toISOString(),
        locale: "en",
        quoteId: quote.id,
      },
    });

    const projectRow = () =>
      db().project.findUniqueOrThrow({
        where: { projectCode: code },
        include: { payments: true, termsAcceptance: true },
      });
    const charge = (project: Awaited<ReturnType<typeof projectRow>>, kind: "deposit" | "final") =>
      project.payments.find((payment) => payment.kind === kind)!;

    await test.step("the customer reads the quote and is offered the deposit", async () => {
      await page.goto(`/quote/${quote.token}`);
      await expect(page.getByText(planName).first()).toBeVisible();
      await expect(page.getByRole("button", { name: "Accept and Pay $1,250.51 Deposit" })).toBeVisible();
    });

    await test.step("an event with a bad signature changes nothing", async () => {
      const rejected = await deliverCheckoutCompleted(baseURL!, depositSession, "whsec_not_the_secret");
      expect(rejected.status).toBe(400);
      expect(await db().project.count({ where: { projectCode: code } })).toBe(0);
    });

    await test.step("the deposit event creates the project with its two charges", async () => {
      const delivery = await deliverCheckoutCompleted(baseURL!, depositSession);
      expect(delivery.status).toBe(200);

      const project = await projectRow();
      expect(delivery.body.projectId).toBe(project.id);
      expect(project).toMatchObject({
        email: customerEmail,
        planName,
        totalAmount: total,
        status: "in_progress",
        locale: "en",
        contactId: contact.id,
      });
      expect(project.billingAddress).toMatchObject({ state: "TX", postalCode: "77002" });
      expect(project.payments).toHaveLength(2);
      expect(charge(project, "deposit")).toMatchObject({
        amount: depositAmount,
        taxAmount: depositTax,
        status: "paid",
        method: "stripe",
        stripeSessionId: depositSessionId,
      });
      expect(charge(project, "final")).toMatchObject({ amount: finalAmount, status: "pending", paidAt: null });
      expect(project.termsAcceptance).not.toBeNull();

      const accepted = await db().quote.findUniqueOrThrow({ where: { id: quote.id } });
      expect(accepted).toMatchObject({ status: "accepted", projectId: project.id });
      const lead = await db().contact.findUniqueOrThrow({ where: { id: contact.id } });
      expect(lead.leadStatus).toBe("WON");
    });

    await test.step("the same event delivered again does not create a second project", async () => {
      const retry = await deliverCheckoutCompleted(baseURL!, depositSession);
      expect(retry.status).toBe(200);
      expect(await db().project.count({ where: { email: customerEmail } })).toBe(1);
      expect(await db().payment.count({ where: { project: { email: customerEmail } } })).toBe(2);
    });

    const project = await projectRow();

    await test.step("the quote page shows it accepted and links to the project", async () => {
      await page.goto(`/quote/${quote.token}`);
      await expect(page.getByText("Quote accepted")).toBeVisible();
      await expect(page.getByRole("button", { name: /Accept and Pay/ })).toHaveCount(0);
      await page.getByRole("link", { name: /Track progress/ }).click();
      await expect(page).toHaveURL(new RegExp(`/project/${project.accessToken}`));
      await expect(page.getByText(planName).first()).toBeVisible();
    });

    await test.step("the payment link does not work before the project is ready", async () => {
      await page.goto(`/pay/${project.accessToken}`);
      await expect(page).toHaveURL(/\/final-payment\?error=project-not-ready/);
    });

    await signIn(page);
    const payments = page.getByRole("region", { name: "Payments" });

    await test.step("the admin sees the deposit paid and marks the project ready", async () => {
      await page.goto(`/projects/${project.id}`);
      await expect(page.getByRole("heading", { level: 1, name: new RegExp(`Project ${code}`) })).toBeVisible();
      await expect(page.getByRole("region", { name: "Customer", exact: true })).toContainText("Won");
      await expect(payments).toContainText("$1,250.51");
      await expect(payments.getByText("Paid", { exact: true })).toHaveCount(1);
      await expect(payments.getByText("Pending", { exact: true })).toHaveCount(1);

      await page.getByRole("button", { name: "Mark ready & email payment link" }).click();
      // The status changes even though the email cannot be sent here
      await expect(page.getByText(`${code} is now ready for payment`)).toBeVisible({ timeout: 15_000 });
      await expect(page.getByRole("button", { name: "Mark ready & email payment link" })).toHaveCount(0);
      expect((await projectRow()).status).toBe("ready_for_payment");
    });

    const finalSession = checkoutSession({
      id: finalSessionId,
      amount: finalAmount,
      metadata: { paymentType: "final", projectId: project.id, projectCode: code },
    });

    await test.step("the final payment event completes the project", async () => {
      const delivery = await deliverCheckoutCompleted(baseURL!, finalSession);
      expect(delivery.status).toBe(200);
      expect(delivery.body.completed).toBe(true);

      const paid = await projectRow();
      expect(paid.status).toBe("completed");
      expect(charge(paid, "final")).toMatchObject({
        status: "paid",
        method: "stripe",
        taxAmount: 0,
        stripeSessionId: finalSessionId,
      });
      expect(charge(paid, "final").paidAt).not.toBeNull();
    });

    await test.step("a payment from another session is not recorded over the first", async () => {
      const second = await deliverCheckoutCompleted(
        baseURL!,
        checkoutSession({ id: `${finalSessionId}_again`, amount: finalAmount, metadata: finalSession.metadata })
      );
      expect(second.status).toBe(200);
      expect(second.body.warning).toContain("already settled");
      expect(charge(await projectRow(), "final").stripeSessionId).toBe(finalSessionId);
    });

    await test.step("the admin sees both charges paid and the project completed", async () => {
      await page.reload();
      await expect(payments.getByText("Paid", { exact: true })).toHaveCount(2);
      await expect(payments.getByText("Pending", { exact: true })).toHaveCount(0);
      await expect(page.getByText("Completed", { exact: true }).first()).toBeVisible();
      await expect(page.getByRole("button", { name: "Record payment" })).toHaveCount(0);
    });

    await test.step("the payment link now leads to the paid page", async () => {
      await page.goto(`/pay/${project.accessToken}`);
      await expect(page).toHaveURL(/\/payment-complete$/);
      await expect(page.getByRole("heading", { name: /Project Fully Paid/ })).toBeVisible();
    });
  });

  test("a final payment for a project that does not exist is answered 404", async ({ baseURL }) => {
    const delivery = await deliverCheckoutCompleted(
      baseURL!,
      checkoutSession({
        id: `cs_test_e2e_orphan_${Date.now()}`,
        amount: 50_000,
        metadata: { paymentType: "final", projectId: randomUUID(), projectCode: "NOPE00" },
      })
    );
    expect(delivery.status).toBe(404);
  });
});
