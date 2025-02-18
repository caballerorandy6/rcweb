import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <Image
        src="/logo.webp"
        alt="logo"
        width={1920}
        height={1080}
        className="w-6/12 sm:w-5/12 md:w-4/12 lg:w-3/12 h-auto mx-auto"
        priority
      />
    </Link>
  );
};

export default Logo;
