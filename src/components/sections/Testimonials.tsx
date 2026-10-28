import { StarIcon } from "@heroicons/react/24/solid";
import Heading from "../ui/Heading";
import Button from "../ui/Button";
import StarRating from "../ui/StarRating";
import { testimonials, GOOGLE_REVIEW_URL } from "@/lib/data";
import { getPublicGoogleReviews } from "@/lib/googleReviews/queries";
import { formatDate } from "@/lib/utils";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

interface Card {
  key: string;
  author: string;
  /** Empresa (testimonios fijos) o fecha de la reseña (Google). */
  meta: string | null;
  rating: number;
  content: string;
}

/**
 * Server Component: las reseñas van en el HTML (SEO + sin JS). Lee las
 * reseñas reales del perfil de Google guardadas por el cron semanal; si aún
 * no hay ninguna, enseña los testimonios fijos de `src/lib/data.ts`.
 */
const Testimonials = async () => {
  const google = await getPublicGoogleReviews();

  const cards: Card[] = google
    ? google.reviews.map((review) => ({
        key: review.id,
        author: review.author,
        meta: formatDate(review.createTime),
        rating: review.rating,
        content: review.text,
      }))
    : testimonials.map((testimonial) => ({
        key: testimonial.author,
        author: testimonial.author,
        meta: testimonial.company || null,
        rating: testimonial.rating,
        content: testimonial.content,
      }));

  return (
    <section
      id="testimonials"
      className="relative isolate overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<StarIcon />}
          text="Real results from successful projects"
        >
          What My Clients Say
        </Heading>

        {google && (
          <p className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-inter text-white/80">
            <StarRating rating={google.averageRating} size="lg" />
            <span>
              <span className="font-semibold text-white">
                {google.averageRating.toFixed(1)}
              </span>{" "}
              on Google
              <span className="text-white/40" aria-hidden="true">
                {" "}
                ·{" "}
              </span>
              {google.totalReviewCount} {google.totalReviewCount === 1 ? "review" : "reviews"}
            </span>
          </p>
        )}

        <div className="mx-auto mt-16 flex flex-wrap justify-center gap-6 lg:gap-8">
          {cards.map((card) => (
            <div
              key={card.key}
              className="reveal group relative rounded-2xl border border-gold/20 bg-gray-900/50 p-6 lg:p-8 transition duration-200 hover:border-gold/50 hover:bg-gold/5 hover:scale-105 shadow-lg shadow-black/20 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1.5rem)]"
            >
              {/* Google badge */}
              <div className="absolute top-4 right-4">
                <GoogleIcon />
              </div>

              <StarRating rating={card.rating} className="flex" />

              <blockquote className="mt-6">
                <p className="text-sm sm:text-base font-inter text-white/80 leading-relaxed line-clamp-6">
                  &quot;{card.content}&quot;
                </p>
              </blockquote>

              <div className="mt-8 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center">
                  <span className="text-base font-inter font-semibold text-gold">
                    {card.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-inter text-white">{card.author}</p>
                  {card.meta && (
                    <p className="text-xs font-inter text-gold/80">{card.meta}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Link to leave a review */}
        <div className="text-center mt-12">
          <Button href={GOOGLE_REVIEW_URL} external variant="secondary">
            <GoogleIcon />
            Write a Review on Google
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
