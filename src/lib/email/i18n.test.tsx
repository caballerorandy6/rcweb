import { describe, expect, it } from "vitest";
import { render } from "@react-email/components";
import type { ReactElement } from "react";
import type { Locale } from "@/i18n/routing";
import en from "@/messages/en.json";
import es from "@/messages/es.json";
import { parseCheckoutMetadata } from "@/lib/checkoutMetadata";
import { formatLongDate } from "./i18n";
import {
  ContactConfirmationEmail,
  InvoiceEmail,
  MilestoneCompletedEmail,
  ProjectReadyEmail,
  QuoteEmail,
  SubscriptionConfirmationEmail,
  SubscriptionPaymentFailedEmail,
  SubscriptionPortalLinkEmail,
  SubscriptionRenewalReminderEmail,
} from "./templates";

const date = new Date("2026-11-15T12:00:00Z");
const base = { customerName: "Ana", planName: "Plan X" };

const templates: [string, (locale: Locale) => ReactElement, string, string][] = [
  ["contact", (locale) => <ContactConfirmationEmail {...base} locale={locale} siteUrl="https://x.test" />, "Thanks for reaching out!", "¡Gracias por escribir!"],
  ["quote", (locale) => <QuoteEmail {...base} locale={locale} quoteNumber="Q-1" scope={["A"]} notes={null} totalAmount={100000} depositAmount={50000} balanceAmount={50000} expiresAt={date} quoteUrl="https://x.test/q" />, "Your Quote is Ready", "Tu presupuesto está listo"],
  ["invoice initial", (locale) => <InvoiceEmail {...base} locale={locale} type="initial" invoiceNumber="I-1" firstPayment={50000} secondPayment={50000} totalAmount={100000} />, "Payment Confirmed!", "¡Pago confirmado!"],
  ["invoice final", (locale) => <InvoiceEmail {...base} locale={locale} type="final" invoiceNumber="I-1" firstPayment={50000} secondPayment={50000} totalAmount={100000} />, "Final Payment Received!", "¡Pago final recibido!"],
  ["invoice summary", (locale) => <InvoiceEmail {...base} locale={locale} type="summary" invoiceNumber="I-1" firstPayment={50000} secondPayment={50000} totalAmount={100000} />, "Project Complete!", "¡Proyecto completado!"],
  ["milestone", (locale) => <MilestoneCompletedEmail {...base} locale={locale} projectCode="ABC123" milestoneTitle="M1" milestoneDescription={null} completedAt={date} completedCount={1} totalCount={2} milestones={[{ title: "M1", status: "completed" }, { title: "M2", status: "pending" }]} projectUrl="https://x.test/p" />, "Milestone Completed", "Hito completado"],
  ["ready", (locale) => <ProjectReadyEmail {...base} locale={locale} projectCode="ABC123" finalAmount={50000} customerEmail="a@x.test" paymentUrl="https://x.test/pay" />, "Your Project is Ready!", "¡Tu proyecto está listo!"],
  ["subscription", (locale) => <SubscriptionConfirmationEmail {...base} locale={locale} amount={20000} nextBillingDate={date} />, "Subscription Activated!", "¡Suscripción activada!"],
  ["failed", (locale) => <SubscriptionPaymentFailedEmail {...base} locale={locale} amount={20000} updatePaymentUrl="https://x.test/m" />, "Payment Failed", "Pago fallido"],
  ["portal", (locale) => <SubscriptionPortalLinkEmail {...base} locale={locale} portalUrl="https://x.test/m" />, "Manage Your Subscription", "Gestiona tu suscripción"],
  ["renewal", (locale) => <SubscriptionRenewalReminderEmail {...base} locale={locale} amount={20000} renewalDate={date} manageUrl="https://x.test/m" />, "Upcoming Renewal", "Próxima renovación"],
];

describe("customer emails", () => {
  it.each(templates)("%s renders in both languages", async (_name, element, english, spanish) => {
    const [htmlEn, htmlEs] = await Promise.all([render(element("en")), render(element("es"))]);

    expect(htmlEn).toContain(english.replace("'", "&#x27;"));
    expect(htmlEs).toContain(spanish);
    expect(htmlEs).not.toContain(english);
    // next-intl prints the key path when a message is missing
    expect(htmlEn + htmlEs).not.toMatch(/Emails\.|MISSING_MESSAGE/);
  });

  it("links to the Spanish pages from a Spanish email", async () => {
    const html = await render(
      <ProjectReadyEmail {...base} locale="es" projectCode="ABC123" finalAmount={50000} customerEmail="a@x.test" paymentUrl="https://x.test/pay" />
    );
    expect(html).toContain("/es/pago-final");
  });

  it("has the same keys in both dictionaries", () => {
    const keys = (value: object, prefix = ""): string[] =>
      Object.entries(value).flatMap(([key, child]) =>
        child && typeof child === "object" && !Array.isArray(child)
          ? keys(child, `${prefix}${key}.`)
          : [`${prefix}${key}`]
      );
    expect(keys(es.Emails)).toEqual(keys(en.Emails));
  });

  it("formats dates in the customer's language", () => {
    expect(formatLongDate(date, "en")).toBe("November 15, 2026");
    expect(formatLongDate(date, "es")).toBe("15 de noviembre de 2026");
  });
});

describe("checkout metadata", () => {
  const initial = {
    paymentType: "initial",
    projectCode: "ABC123",
    planName: "Plan X",
    customerName: "Ana",
    customerEmail: "a@x.test",
    firstPaymentAmount: "50000",
    secondPaymentAmount: "50000",
    totalAmount: "100000",
    termsAcceptedAt: "2026-11-01T00:00:00.000Z",
  };

  it("carries the customer's language", () => {
    const parsed = parseCheckoutMetadata({ ...initial, locale: "es" });
    expect(parsed.success && parsed.data.paymentType === "initial" && parsed.data.locale).toBe("es");
  });

  it("reads sessions created before the field existed as English", () => {
    const parsed = parseCheckoutMetadata(initial);
    expect(parsed.success && parsed.data.paymentType === "initial" && parsed.data.locale).toBe("en");
  });
});
