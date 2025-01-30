import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="-m-1.5 p-1.5 mr-auto w-4/12">
      <Image
        src="/logo.webp"
        alt="logo"
        width={300}
        height={280}
        className="h-32 w-auto object-contain"
      />
    </Link>
  );
};

export default Logo;
