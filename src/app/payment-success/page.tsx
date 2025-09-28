import { handlePaymentSuccessAction } from "@/actions/handlePaymentSuccessAction";
import PaymentSuccess from "@/app/components/PaymentSuccess";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const sessionId = params.session_id as string;
  const code = params.code as string;

  // Manejar el payment con race condition handling
  const result = await handlePaymentSuccessAction(sessionId, code);

  if (result.fallbackUsed) {
    console.warn("⚠️ Webhook no procesó a tiempo, se usó fallback");
  }

  return (
    <PaymentSuccess
      payment={result.payment}
      error={result.error}
      projectCode={code || result.payment?.projectCode}
      fallbackUsed={result.fallbackUsed}
    />
  );
}
