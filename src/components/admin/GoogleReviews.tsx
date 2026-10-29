import { StarIcon } from "@heroicons/react/24/outline";
import {
  getGoogleReviewsAdminAction,
  type AdminGoogleReview,
} from "@/actions/reviews/getGoogleReviewsAdminAction";
import { GOOGLE_REVIEWS_REFRESH_DAYS } from "@/lib/googleReviews/config";
import { formatDate, formatDateTime, formatNumber } from "@/lib/utils";
import StarRating from "@/components/ui/StarRating";
import SyncGoogleReviewsButton from "@/components/admin/SyncGoogleReviewsButton";
import GoogleReviewVisibilityButton from "@/components/admin/GoogleReviewVisibilityButton";

function Metric({ label, value, note }: { label: string; value: React.ReactNode; note?: string }) {
  return (
    <div className="bg-gray-700/30 rounded-lg p-3 text-center">
      <p className="text-xs text-gray-400 font-inter">{label}</p>
      <div className="text-xl sm:text-2xl text-white font-iceland">{value}</div>
      {note && <p className="text-[11px] text-gray-500 font-inter">{note}</p>}
    </div>
  );
}

function ReviewRow({ review }: { review: AdminGoogleReview }) {
  return (
    <li className={`py-3 flex gap-3 ${review.hidden ? "opacity-60" : ""}`}>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-sm text-white font-inter font-semibold truncate">{review.author}</span>
          <StarRating rating={review.rating} size="sm" className="flex" />
          <span className="text-xs text-gray-500 font-inter">{formatDate(review.createTime)}</span>
          {review.hidden && (
            <span className="text-[10px] uppercase tracking-wide text-yellow-400/80 font-inter border border-yellow-400/30 rounded px-1.5 py-0.5">
              Hidden
            </span>
          )}
        </div>
        {review.text ? (
          <p className="text-sm text-gray-300 font-inter mt-1 whitespace-pre-line">{review.text}</p>
        ) : (
          <p className="text-xs text-gray-500 font-inter mt-1 italic">
            Rating only — the site shows reviews with text.
          </p>
        )}
        {review.reply && (
          <p className="text-xs text-gray-400 font-inter mt-2 pl-3 border-l-2 border-gray-600 whitespace-pre-line">
            <span className="text-gray-500">Your reply: </span>
            {review.reply}
          </p>
        )}
      </div>
      {review.text && (
        <div className="shrink-0 self-start">
          <GoogleReviewVisibilityButton id={review.id} author={review.author} hidden={review.hidden} />
        </div>
      )}
    </li>
  );
}

/**
 * Tarjeta del dashboard: nota y total del perfil de Google, última
 * sincronización, botón «Sync now» y ocultar/mostrar cada reseña en la web.
 */
export default async function GoogleReviews() {
  const data = await getGoogleReviewsAdminAction();
  const { summary } = data;

  return (
    <div className="bg-gray-800/80 rounded-xl p-4 sm:p-6 border border-gray-700/50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-5">
        <div className="flex items-center gap-3">
          <StarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gold shrink-0" />
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
        <div className="text-center py-8">
          <StarIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-inter text-sm sm:text-base">No Google reviews yet</p>
          <p className="text-xs sm:text-sm text-gray-500 font-inter mt-1">
            {data.configured
              ? `Press Sync now to load them, or wait for the weekly sync (every ${GOOGLE_REVIEWS_REFRESH_DAYS} days, Mondays 10:00 UTC). Until then the home shows the static testimonials.`
              : "Google reviews are not configured in this environment (GOOGLE_OAUTH_* / GBP_* variables)."}
          </p>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-500 font-inter mb-3">
            Rating and count come from the Business Profile and refresh every{" "}
            {GOOGLE_REVIEWS_REFRESH_DAYS} days. Hidden reviews stay hidden after each sync.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
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

          {data.reviews.length === 0 ? (
            <p className="text-xs text-gray-500 font-inter">No reviews stored.</p>
          ) : (
            <ul className="divide-y divide-gray-700/50 border-t border-gray-700/50">
              {data.reviews.map((review) => (
                <ReviewRow key={review.id} review={review} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
