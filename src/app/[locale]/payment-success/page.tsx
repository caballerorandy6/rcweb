import { Suspense } from "react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import PageMessages from "@/components/layout/PageMessages";
import type { Locale } from "@/i18n/routing";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import { getProjectCharges } from "@/lib/project/charges";
import { maintenancePlanFeatures, subscriptionPlanName } from "@/lib/maintenancePlan";
import type { PaymentSuccessData } from "@/types/project";
import PaymentSuccess from "@/components/payment/PaymentSuccess";
import SubscriptionSuccess from "@/components/payment/SubscriptionSuccess";
import PaymentSuccessSkeleton from "@/components/skeletons/PaymentSuccessSkeleton";
import { genPageMetadata } from "@/utils/genPageMetadata";

type Props = PageProps<"/[locale]/payment-success">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "PaymentSuccess" });
  return genPageMetadata({
    title: t("metadata.title"),
    description: t("metadata.description"),
    locale,
    pathname: "/payment-success",
    noIndex: true,
  });
}

// Stripe sends the customer here before, or at the same time as, the webhook
// that writes the row. This page only reads: it waits a little for the webhook
// and, if the row is still missing, tells the customer it is being processed.
const WEBHOOK_WAIT_ATTEMPTS = 15;
const WEBHOOK_WAIT_DELAY_MS = 1000;

async function waitForWebhook<T>(
  find: () => Promise<T | null>,
  context: { flow: "project" | "subscription"; sessionId: string }
): Promise<T | null> {
  for (let attempt = 0; attempt < WEBHOOK_WAIT_ATTEMPTS; attempt++) {
    const found = await find();
    if (found) return found;
    if (attempt < WEBHOOK_WAIT_ATTEMPTS - 1) {
      await new Promise((resolve) => setTimeout(resolve, WEBHOOK_WAIT_DELAY_MS));
    }
  }
  // The customer has paid and nothing is in the database: the webhook is
  // late or broken (secret rotated, endpoint URL wrong). Make it visible.
  Sentry.captureMessage("Stripe webhook not received after payment", {
    level: "warning",
    tags: { feature: "stripe-webhook", flow: context.flow },
    extra: { sessionId: context.sessionId },
  });
  return null;
}

// The Checkout Session id is the credential: it is unguessable and only the
// customer who just paid has it. The project code alone (printed in every
// email) would not be enough to show amounts.
async function findPaidDeposit(sessionId: string): Promise<PaymentSuccessData | null> {
  const deposit = await prisma.payment.findUnique({
    where: { stripeSessionId: sessionId, kind: "deposit" },
    include: { project: { include: { payments: true } } },
  });
  if (!deposit) return null;

  const { project } = deposit;
  const { final } = getProjectCharges(project.payments);
  return {
    projectCode: project.projectCode,
    planName: project.planName,
    totalAmount: project.totalAmount,
    depositAmount: deposit.amount,
    depositTax: deposit.taxAmount,
    finalAmount: final.amount,
    stripeSessionId: sessionId,
  };
}

async function Content({ searchParams }: Pick<Props, "searchParams">) {
  const [params, t, locale] = await Promise.all([
    searchParams,
    getTranslations("PaymentSuccess"),
    getLocale() as Promise<Locale>,
  ]);
  const sessionId = typeof params.session_id === "string" ? params.session_id : "";
  const isSubscription = params.subscription === "true";
  const code = typeof params.code === "string" ? params.code : undefined;

  if (!sessionId) {
    return <PaymentSuccess error={t("noSession")} />;
  }

  // Subscription flow
  if (isSubscription) {
    const subscription = await waitForWebhook(
      () => prisma.subscription.findFirst({ where: { stripeSessionId: sessionId } }),
      { flow: "subscription", sessionId }
    );

    if (!subscription) {
      return <SubscriptionSuccess error={t("subscription.processing")} />;
    }

    // Only what the page shows crosses to the client (never the portal token)
    return (
      <SubscriptionSuccess
        subscription={{
          planName: subscriptionPlanName(subscription.planName, locale),
          amount: subscription.amount,
          currency: subscription.currency,
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd,
          email: subscription.email,
          stripeSubscriptionId: subscription.stripeSubscriptionId,
        }}
        features={maintenancePlanFeatures(locale)}
      />
    );
  }

  // 50/50 project flow
  const project = await waitForWebhook(() => findPaidDeposit(sessionId), {
    flow: "project",
    sessionId,
  });

  if (!project) {
    return <PaymentSuccess processing projectCode={code} />;
  }

  return <PaymentSuccess project={project} projectCode={project.projectCode} />;
}

export default function PaymentSuccessPage({ searchParams }: Props) {
  return (
    <PageMessages namespaces={["PaymentSuccess"]}>
      <Suspense fallback={<PaymentSuccessSkeleton />}>
        <Content searchParams={searchParams} />
      </Suspense>
    </PageMessages>
  );
}
