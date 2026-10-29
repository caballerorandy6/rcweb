import GoogleReviewsManagement from "@/components/admin/GoogleReviewsManagement";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata = genPageMetadata({
  title: "Google Reviews",
  description: "Google Business Profile reviews shown on the RC Web Solutions LLC site.",
  pageRoute: "/reviews",
  noIndex: true,
});

// Always rendered per request (the action reads the session from headers)
export const dynamic = "force-dynamic";

// The admin layout already checks the session; the action checks it again.
export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-iceland text-gold">Google reviews</h1>
        <p className="text-gray-400 mt-2 font-inter">
          What the Business Profile says about you, and which reviews the site shows
        </p>
      </div>
      <GoogleReviewsManagement />
    </div>
  );
}
