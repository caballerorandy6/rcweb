import Link from "next/link";
import { StarIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { getGoogleReviewsAdminAction } from "@/actions/reviews/getGoogleReviewsAdminAction";
import { ADMIN_ROUTES } from "@/config/adminRoutes";
import { formatDate, formatDateTime, formatNumber } from "@/lib/utils";
import StarRating from "@/components/ui/StarRating";
import SyncGoogleReviewsButton from "@/components/admin/SyncGoogleReviewsButton";

function Metric({ label, value, note }: { label: string; value: React.ReactNode; note?: string }) {
  return (
    <div className="bg-gray-700/30 rounded-lg p-3 text-center">
      <p className="text-xs text-gray-400 font-inter">{label}</p>
      <div className="text-xl sm:text-2xl text-white font-iceland">{value}</div>
      {note ? <p className="text-[11px] text-gray-500 font-inter">{note}</p> : null}
    </div>
  );
}

/**
 * Dashboard summary: rating, counts, the latest review and the sync button.
 * The full list with Hide/Show lives on /reviews.
 */
export default async function GoogleReviews() {
  const data = await getGoogleReviewsAdminAction();
  const { summary } = data;
  // The action returns reviews newest first
  const latest = data.reviews[0];

  return (
    <div className="bg-gray-800/80 rounded-xl p-4 sm:p-6 border border-gray-700/50">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-5">
        <div className="flex items-center gap-3">
          <StarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gold shrink-0" aria-hidden="true" />
          <h3 className="text-xl sm:text-2xl text-white font-iceland">Google reviews</h3>
        </div>
        <div className="sm:ml-auto flex items-center gap-3">
          <span className="text-xs text-gray-500 font-inter">
            {summary ? `Synced ${formatDateTime(summary.syncedAt)}` : "Never synced"}
          </span>
          <SyncGoogleReviewsButton disabled={!data.configured} />
        </div>
      </div>

      {!summary ? (
        <p className="text-sm text-gray-400 font-inter">
          {data.configured
            ? "No Google reviews yet. Press Sync now to load them; until then the home shows the static testimonials."
            : "Google reviews are not configured in this environment (GOOGLE_OAUTH_* / GBP_* variables)."}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            <Metric
              label="Rating"
              value={
                <span className="inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                  {summary.averageRating.toFixed(1)}
                  <StarRating rating={summary.averageRating} size="sm" className="flex" />
                </span>
              }
            />
            <Metric label="Reviews on Google" value={formatNumber(summary.totalReviewCount)} />
            <Metric
              label="Shown on the site"
              value={formatNumber(data.shownOnSite)}
              note="newest with text"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-4 pt-4 border-t border-gray-700/50 font-inter">
            {latest ? (
              <p className="min-w-0 flex-1 text-sm text-gray-300 truncate">
                <span className="text-gray-500">Latest: </span>
                <span className="text-white font-semibold">{latest.author}</span>
                <StarRating rating={latest.rating} size="sm" className="inline-flex align-middle mx-2" />
                <span className="text-gray-500">{formatDate(latest.createTime)}</span>
              </p>
            ) : (
              <p className="flex-1 text-sm text-gray-500">No reviews stored.</p>
            )}
            <Link
              href={ADMIN_ROUTES.reviews}
              className="inline-flex items-center gap-1 text-sm text-gold hover:underline shrink-0"
            >
              Manage reviews
              <ArrowRightIcon className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
