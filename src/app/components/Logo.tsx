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
        className="w-2/12 h-auto object-contain mx-auto"
        priority
      />
    </Link>
  );
};

export default Logo;
