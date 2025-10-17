"use client";

import Marquee from "react-fast-marquee";
import { repeatedIcons } from "@/lib/data";
import { useId } from "react";

export interface TeachMarqueeProps {
  href: string;
  name: string;
  icon: React.ReactNode;
}

const TechMarquee = () => {
  const id = useId();
  return (
    <Marquee speed={100} gradient={false} pauseOnHover={true}>
      <div className="flex items-center">
        {repeatedIcons.map((item, index) => (
          <a
            target="_blank"
            rel="noopener noreferrer"
            key={`${id}-${item.name}-${index}`}
            href={item.href}
            className="flex items-center justify-center text-gray-100 hover:text-gold transition-all duration-200 ease-in-out hover:scale-105 mx-12"
          >
            {item.icon}
          </a>
        ))}
      </div>
    </Marquee>
  );
};

export default TechMarquee;
