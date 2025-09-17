import { updatePaymentStatusAction } from "@/actions/updatePaymentStatusAction";
import Link from "next/link";
import { CopyButton } from "@/app/components/CopyButton";

type SearchParams = Promise<{ code?: string; session_id?: string }>;

export default async function PaymentSuccessPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const projectCode = searchParams.code;
  const sessionId = searchParams.session_id;

  // Actualizar estado de pago solo si tenemos projectCode y sessionId
  if (projectCode && sessionId) {
    await updatePaymentStatusAction(projectCode);
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 pt-24 lg:pt-32">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl p-8 text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-gold mb-6 font-iceland">
          Payment Successful!
        </h1>

        <p className="text-gray-300 mb-6 font-inter">
          Your initial payment (50%) has been processed. We&apos;ll start
          working on your project immediately!
        </p>

        {projectCode && (
          <div className="bg-gray-700 rounded-lg p-6 mb-6 font-inter">
            <p className="text-sm text-gray-300 mb-3">Your Project Code:</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-bold text-gold font-mono">
                {projectCode}
              </span>
              <CopyButton code={projectCode} />
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Save this code! You&apos;ll need it along with your email to make
              the final payment.
            </p>
          </div>
        )}

        <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6 font-inter">
          <h3 className="text-white font-semibold mb-2">What&apos;s Next?</h3>
          <ul className="text-sm text-gray-300 text-left space-y-1">
            <li>✓ You&apos;ll receive a confirmation email</li>
            <li>✓ We&apos;ll contact you within 24 hours</li>
            <li>✓ Project will be ready in 2–3 weeks</li>
            <li>✓ Final payment (50%) due upon completion</li>
          </ul>
        </div>

        <Link
          href="/"
          className="inline-block bg-gold text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors font-inter"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
