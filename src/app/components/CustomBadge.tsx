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
      className="flex items-center justify-center mt-10"
    >
      <span className="relative inline-flex overflow-hidden rounded-full p-[1px] transition-transform duration-200 ease-in-out hover:scale-105">
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#CBB26A_0%,#8B7945_50%,#CBB26A_100%)]"></span>
        <div className="inline-flex items-center justify-center w-full px-3 py-1 text-sm text-[#8B7945] bg-[#CBB26A] rounded-full cursor-pointer dark:bg-gray-800 dark:text-white/80 backdrop-blur-3xl whitespace-nowrap">
          {children}
        </div>
      </span>
    </Link>
  );
};

export default CustomBadge;
