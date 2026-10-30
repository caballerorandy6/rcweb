import { redirect } from "next/navigation";
import { VideoCameraIcon } from "@heroicons/react/24/outline";
import TikTokPublisher from "@/components/tiktok/TikTokPublisher";
import { isTikTokConfigured, TIKTOK_TOOL_PATH } from "@/lib/tiktok/config";
import { readTikTokSession } from "@/lib/tiktok/session";
import { genPageMetadata } from "@/utils/genPageMetadata";

// Private tool: not indexed, not in the sitemap, not linked from the site.
export const metadata = genPageMetadata({
  title: "TikTok Publisher",
  description: "Internal tool: publish a video to the RC Web Solutions TikTok account.",
  pageRoute: TIKTOK_TOOL_PATH,
  noIndex: true,
});

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const ERROR_MESSAGES: Record<string, string> = {
  not_configured: "TikTok credentials are not configured on this deployment.",
  state_mismatch: "The sign-in could not be verified (state mismatch). Please try again.",
  missing_code: "TikTok did not return an authorization code.",
  token_exchange_failed: "TikTok did not issue an access token. Please try again.",
  access_denied: "You cancelled the TikTok authorization.",
};

export default async function TikTokToolPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const code = typeof params.code === "string" ? params.code : null;
  const state = typeof params.state === "string" ? params.state : null;

  // TikTok redirects here; cookies can only be set from a route handler.
  if (code && state) {
    const callback = new URLSearchParams({ code, state });
    redirect(`${TIKTOK_TOOL_PATH}/api/callback?${callback.toString()}`);
  }

  const session = await readTikTokSession();
  const errorCode = typeof params.error === "string" ? params.error : null;
  const errorDescription =
    typeof params.error_description === "string" ? params.error_description : null;
  const errorMessage = errorCode
    ? ERROR_MESSAGES[errorCode] || errorDescription || `TikTok returned an error (${errorCode}).`
    : null;

  return (
    <div className="min-h-screen bg-gray-900 px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-gold w-6 h-6 lg:w-8 lg:h-8" aria-hidden="true">
              <VideoCameraIcon />
            </span>
            <h1 className="text-3xl text-gold font-iceland sm:text-4xl lg:text-5xl">
              TikTok Publisher
            </h1>
          </div>
          <p className="mt-4 text-base sm:text-lg font-inter text-white/80 leading-relaxed">
            Post a video straight to the connected TikTok account.
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="mt-8 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200 font-inter"
          >
            {errorMessage}
          </div>
        )}

        <div className="mt-10 rounded-2xl border border-gold/20 bg-gray-900/50 p-6 sm:p-8 shadow-lg shadow-black/20">
          {session ? (
            <TikTokPublisher />
          ) : (
            <ConnectPanel configured={isTikTokConfigured()} />
          )}
        </div>
      </div>
    </div>
  );
}

function ConnectPanel({ configured }: { configured: boolean }) {
  return (
    <div className="text-center font-inter">
      <h2 className="text-2xl text-white font-semibold">Connect your TikTok account</h2>
      <p className="mt-3 text-gray-300">
        You will be sent to TikTok to approve access to your profile (name and
        avatar) and to publish videos on your behalf. You can disconnect at any time.
      </p>
      <div className="mt-8">
        {configured ? (
          <a
            href={`${TIKTOK_TOOL_PATH}/api/connect`}
            className="relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-base sm:text-lg font-inter font-semibold text-black bg-linear-to-r from-gold via-gold-light to-gold hover:from-gold-light hover:via-gold hover:to-gold-light shadow-lg hover:shadow-gold/25 transition duration-300"
          >
            Connect TikTok
          </a>
        ) : (
          <p className="text-sm text-gray-400">
            Set <code className="text-gold">TIKTOK_CLIENT_KEY</code> and{" "}
            <code className="text-gold">TIKTOK_CLIENT_SECRET</code> to enable this tool.
          </p>
        )}
      </div>
    </div>
  );
}
