import Link from "next/link";

//import Image from "next/image";
interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    // <Image
    //   src="/logo.avif"
    //   alt="logo"
    //   width={400} // un ancho realista
    //   height={200}
    //   className="mx-auto h-auto w-auto max-w-[60%] sm:max-w-[50%] md:max-w-[40%] lg:max-w-[30%]"
    //   priority
    // />

    <Link href="/">
      <svg
        width="300"
        height="100"
        viewBox="0 0 300 100"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="RC Web Logo"
        className={`${className} rounded-full p-2`}
      >
        <text
          x="10"
          y="65"
          fontSize="90"
          fill="#CBB26A"
          fontFamily="Iceland, sans-serif"
        >
          RC Web
        </text>
      </svg>
    </Link>
  );
};

export default Logo;
