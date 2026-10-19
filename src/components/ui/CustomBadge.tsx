import Link from "next/link";
import { ReactNode } from "react";

interface CustomBadgeProps {
  children: ReactNode;
}

const CustomBadge = ({ children }: CustomBadgeProps) => {
  return (
    <Link
      href="https://www.linkedin.com/in/caballerorandy/"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center mt-10"
    >
      <span className="relative inline-flex overflow-hidden rounded-full p-px transition-transform duration-200 ease-in-out hover:scale-105">
        {/* Rotating border: a square just larger than the badge (not a
            huge inset) spinning three turns, then it rests as a static gradient */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 aspect-square w-[110%] -translate-x-1/2 -translate-y-1/2 animate-[spin_2s_linear_3] bg-[conic-gradient(from_90deg_at_50%_50%,#CBB26A_0%,#8B7945_50%,#CBB26A_100%)]"
        ></span>
        <div className="relative inline-flex items-center justify-center w-full px-3 py-1 text-sm text-gray-900 bg-gold rounded-full whitespace-nowrap font-inter font-medium">
          {children}
        </div>
      </span>
    </Link>
  );
};

export default CustomBadge;
