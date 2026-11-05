import type { CSSProperties } from "react";

interface StarRatingProps {
  /** Nota de 0 a 5; admite decimales (4,7 pinta el 70 % de la quinta estrella). */
  rating: number;
  size?: "sm" | "md" | "lg";
  /** Display incluido: `block` por defecto, `inline-block` dentro de una línea de texto */
  className?: string;
  /** Accessible name in the visitor's language; English by default */
  label?: string;
}

/** Lado de cada estrella en px y clases para cinco estrellas con 4 px de hueco */
const SIZES = {
  sm: { star: 16, box: "h-4 w-24" },
  md: { star: 20, box: "h-5 w-29" },
  lg: { star: 24, box: "h-6 w-34" },
} as const;
const GAP = 4;

/**
 * Cinco estrellas con relleno proporcional a la nota, en un solo elemento:
 * la utilidad `star-rating` recorta un degradado con una estrella cada
 * `--tile` px (estrella + hueco; el ancho deja fuera el último hueco), y
 * `--stop` marca dónde acaba el dorado contando solo las estrellas, no los
 * huecos. Antes eran diez SVG por nota, que pesaban unos 31 KB en la home y
 * otros tantos en el payload RSC. Server Component, sin JS. La raíz es un
 * `span` para poder ir dentro de un `<p>`.
 */
export default function StarRating({ rating, size = "md", className = "block", label }: StarRatingProps) {
  const value = Math.max(0, Math.min(5, rating));
  const name = label ?? `${Number(value.toFixed(1))} out of 5 stars`;
  const { star, box } = SIZES[size];
  const full = Math.floor(value);
  const stop = full * (star + GAP) + (value - full) * star;

  return (
    <span
      className={`star-rating shrink-0 ${box} ${className}`}
      style={{ "--tile": `${star + GAP}px`, "--stop": `${stop}px` } as CSSProperties}
      role="img"
      aria-label={name}
    />
  );
}
