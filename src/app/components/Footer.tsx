import Link from "next/link";
import { navigation } from "@/libs/data";

const Footer = () => {
  return (
    <footer className="flex flex-col justify-center items-center lg:flex-row  w-8/12 lg:justify-between mx-auto pt-8 pb-12">
      <ul className="flex gap-x-4 leading-relaxed">
        {navigation.slice(0, -1).map((item) => (
          <Link
            key={item.name}
            href={item.hash}
            className="text-white/80 hover:text-gold transition-colors font-inter"
          >
            {item.name}
          </Link>
        ))}
      </ul>
      <p className="text-gold leading-relaxed font-iceland text-2xl">
        {`© ${new Date().getFullYear()} RC Web. All Rights Reserved.`}
      </p>
    </footer>
  );
};

export default Footer;
