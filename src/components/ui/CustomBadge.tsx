import { ReactNode } from "react";

interface CustomBadgeProps {
  children: ReactNode;
}

/** Decorative pill under the hero headline; plain text, not a link. */
const CustomBadge = ({ children }: CustomBadgeProps) => {
  return (
    <div className="mt-10 flex justify-center">
      <span className="relative inline-flex overflow-hidden rounded-full p-px">
        {/* Rotating border: a square just larger than the badge spinning
            three turns, then it rests as a static gradient */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 aspect-square w-[110%] -translate-x-1/2 -translate-y-1/2 animate-[spin_2s_linear_3] bg-[conic-gradient(from_90deg_at_50%_50%,var(--color-gold)_0%,var(--color-gold-darker)_50%,var(--color-gold)_100%)]"
        ></span>
        <span className="relative inline-flex items-center justify-center px-3 py-1 text-sm text-gray-900 bg-gold rounded-full whitespace-nowrap font-inter font-medium">
          {children}
        </span>
      </span>
    </div>
  );
};

export default CustomBadge;
