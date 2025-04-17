import Link from "next/link";
import Marquee from "react-fast-marquee";
import { teachMarqueeData } from "@/libs/arrays";

export interface TeachMarqueeProps {
  href: string;
  name: string;
  icon: React.ReactNode;
}

const TechMarquee = () => (
  <Marquee speed={100} gradient={false} pauseOnHover={true}>
    <div className="flex items-center gap-x-24 w-full">
      {teachMarqueeData.map((item) => (
        <Link
          target="_blank"
          key={item.name}
          href={item.href}
          className="flex items-center justify-center text-gray-100 hover:text-gold transition-all duration-200 ease-in-out hover:scale-105 p-2"
        >
          {item.icon}
        </Link>
      ))}
    </div>
  </Marquee>
);

export default TechMarquee;
