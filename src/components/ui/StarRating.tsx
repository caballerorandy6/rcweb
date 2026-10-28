import { StarIcon } from "@heroicons/react/24/solid";

interface StarRatingProps {
  /** Nota de 0 a 5; admite decimales (4,7 pinta el 70 % de la quinta estrella). */
  rating: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" } as const;

/**
 * Cinco estrellas con relleno proporcional a la nota. Cada estrella lleva su
 * propia capa dorada recortada por anchura, así el fraccionado es exacto sin
 * depender de los huecos entre estrellas. Server Component, sin JS. La raíz
 * es un `span` para poder ir dentro de un `<p>` sin romper el HTML.
 */
export default function StarRating({ rating, size = "md", className = "" }: StarRatingProps) {
  const value = Math.max(0, Math.min(5, rating));
  const label = `${Number(value.toFixed(1))} out of 5 stars`;
  const box = SIZES[size];

  return (
    <span className={`inline-flex gap-1 ${className}`} role="img" aria-label={label}>
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.max(0, Math.min(1, value - index));
        return (
          <span key={index} className={`relative block ${box}`} aria-hidden="true">
            <StarIcon className={`absolute inset-0 ${box} text-white/20`} />
            <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <StarIcon className={`${box} max-w-none text-yellow-400`} />
            </span>
          </span>
        );
      })}
    </span>
  );
}
